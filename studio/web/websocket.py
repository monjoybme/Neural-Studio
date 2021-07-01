from .server import Request
from .headers import *

from json import dumps, loads
from base64 import b64encode
from hashlib import sha1

MAGIC_STRING = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11".encode()

class WebSocketServer(object):
    indexMasksLengths = {
        126: 4,
        127: 10
    }

    def __init__(self, request: Request) -> None:
        self.request = request

        self._writer = request.writer
        self._reader = request.reader
        self._secret_key = b64encode(sha1(
            request.headers.sec_websocket_key['value'].encode() + MAGIC_STRING).digest())

        response = ResponseHeader() | 101
        response += upgrade("websocket")
        response += connection("Upgrade")
        response += sec_websocket_accept(self._secret_key.decode())
        request.writer.write(response.encode())

    def __enter__(self, ):
        return self

    def __exit__(self, type, value, traceback)->bool:
        self._writer.close()
        return True

    async def recv_raw(self, )->bytes:
        return await self._reader.read(128)

    async def recv(self, ) -> bytes:
        data = await self._reader.read(128)
        return self.decode_frame(data)

    async def recv_json(self, ) -> dict:
        data = await self._reader.read(128)
        return loads(self.decode_frame(data))

    async def send(self, data: str) -> bool:
        frame = self.encode_frame(data)
        self._writer.write(frame)

    async def send_json(self, data: dict) -> bool:
        frame = dumps(data)
        frame = self.encode_frame(frame)
        self._writer.write(frame)

    def decode_frame(self, data: bytes) -> str:
        try:
            frame = bytearray(data)
            length = frame[1] & 127
            indexFirstMask = self.indexMasksLengths[length] if length in self.indexMasksLengths else 2
            indexFirstDataByte = indexFirstMask + 4
            mask = frame[indexFirstMask:indexFirstDataByte]

            j = 0
            i = indexFirstDataByte
            decoded = str()
            while i < len(frame):
                decoded += chr(frame[i] ^ mask[j % 4])
                i += 1
                j += 1

            return decoded
        except IndexError as e:
            return False

    def encode_frame(self, data: str) -> None:
        bytesFormatted = []
        bytesFormatted.append(129)
        bytesRaw = data.encode()
        bytesLength = len(bytesRaw)
        if bytesLength <= 125:
            bytesFormatted.append(bytesLength)
        elif bytesLength >= 126 and bytesLength <= 65535:
            bytesFormatted.append(126)
            bytesFormatted.append((bytesLength >> 8) & 255)
            bytesFormatted.append(bytesLength & 255)
        else:
            bytesFormatted.append(127)
            bytesFormatted.append((bytesLength >> 56) & 255)
            bytesFormatted.append((bytesLength >> 48) & 255)
            bytesFormatted.append((bytesLength >> 40) & 255)
            bytesFormatted.append((bytesLength >> 32) & 255)
            bytesFormatted.append((bytesLength >> 24) & 255)
            bytesFormatted.append((bytesLength >> 16) & 255)
            bytesFormatted.append((bytesLength >> 8) & 255)
            bytesFormatted.append(bytesLength & 255)

        bytesFormatted = bytes(bytesFormatted)
        bytesFormatted = bytesFormatted + bytesRaw
        return bytesFormatted
