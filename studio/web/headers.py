import re

from typing import List

mime_types = {
 '3dm': 'x-world/x-3dmf',
 '3dmf': 'x-world/x-3dmf',
 'a': 'application/octet-stream',
 'aa': 'application/x-authorware-bin',
 'aam': 'application/x-authorware-map',
 'aas': 'application/x-authorware-seg',
 'abc': 'text/vnd.abc',
 'acgi': 'text/html',
 'afl': 'video/animaflex',
 'ai': 'application/postscript',
 'aif': 'audio/x-aiff',
 'aifc': 'audio/x-aiff',
 'aiff': 'audio/x-aiff',
 'aim': 'application/x-aim',
 'aip': 'text/x-audiosoft-intra',
 'ani': 'application/x-navi-animation',
 'aos': 'application/x-nokia-9000-communicator-add-on-software',
 'aps': 'application/mime',
 'arc': 'application/octet-stream',
 'arj': 'application/octet-stream',
 'art': 'image/x-jg',
 'asf': 'video/x-ms-asf',
 'asm': 'text/x-asm',
 'asp': 'text/asp',
 'asx': 'video/x-ms-asf-plugin',
 'au': 'audio/x-au',
 'avi': 'video/x-msvideo',
 'avs': 'video/avs-video',
 'bcpio': 'application/x-bcpio',
 'bin': 'application/x-macbinary',
 'bm': 'image/bmp',
 'bmp': 'image/x-windows-bmp',
 'boo': 'application/book',
 'book': 'application/book',
 'boz': 'application/x-bzip2',
 'bsh': 'application/x-bsh',
 'bz': 'application/x-bzip',
 'bz2': 'application/x-bzip2',
 'c': 'text/x-c',
 'c++': 'text/plain',
 'cat': 'application/vnd.ms-pki.seccat',
 'cc': 'text/x-c',
 'ccad': 'application/clariscad',
 'cco': 'application/x-cocoa',
 'cdf': 'application/x-netcdf',
 'cer': 'application/x-x509-ca-cert',
 'cha': 'application/x-chat',
 'chat': 'application/x-chat',
 'class': 'application/x-java-class',
 'com': 'text/plain',
 'conf': 'text/plain',
 'cpio': 'application/x-cpio',
 'cpp': 'text/x-c',
 'cpt': 'application/x-cpt',
 'crl': 'application/pkix-crl',
 'crt': 'application/x-x509-user-cert',
 'csh': 'text/x-script.csh',
 'css': 'text/css',
 'cxx': 'text/plain',
 'dcr': 'application/x-director',
 'deepv': 'application/x-deepv',
 'def': 'text/plain',
 'der': 'application/x-x509-ca-cert',
 'dif': 'video/x-dv',
 'dir': 'application/x-director',
 'dl': 'video/x-dl',
 'doc': 'application/msword',
 'dot': 'application/msword',
 'dp': 'application/commonground',
 'drw': 'application/drafting',
 'dump': 'application/octet-stream',
 'dv': 'video/x-dv',
 'dvi': 'application/x-dvi',
 'dwf': 'model/vnd.dwf',
 'dwg': 'image/x-dwg',
 'dxf': 'image/x-dwg',
 'dxr': 'application/x-director',
 'el': 'text/x-script.elisp',
 'elc': 'application/x-elc',
 'env': 'application/x-envoy',
 'eps': 'application/postscript',
 'es': 'application/x-esrehber',
 'etx': 'text/x-setext',
 'evy': 'application/x-envoy',
 'exe': 'application/octet-stream',
 'f': 'text/x-fortran',
 'f77': 'text/x-fortran',
 'f90': 'text/x-fortran',
 'fdf': 'application/vnd.fdf',
 'fif': 'image/fif',
 'fli': 'video/x-fli',
 'flo': 'image/florian',
 'flx': 'text/vnd.fmi.flexstor',
 'fmf': 'video/x-atomic3d-feature',
 'for': 'text/x-fortran',
 'fpx': 'image/vnd.net-fpx',
 'frl': 'application/freeloader',
 'funk': 'audio/make',
 'g': 'text/plain',
 'g3': 'image/g3fax',
 'gif': 'image/gif',
 'gl': 'video/x-gl',
 'gsd': 'audio/x-gsm',
 'gsm': 'audio/x-gsm',
 'gsp': 'application/x-gsp',
 'gss': 'application/x-gss',
 'gtar': 'application/x-gtar',
 'gz': 'application/x-gzip',
 'gzip': 'multipart/x-gzip',
 'h': 'text/x-h',
 'hdf': 'application/x-hdf',
 'help': 'application/x-helpfile',
 'hgl': 'application/vnd.hp-hpgl',
 'hh': 'text/x-h',
 'hl': 'text/x-script',
 'hlp': 'application/x-winhelp',
 'hpg': 'application/vnd.hp-hpgl',
 'hpgl': 'application/vnd.hp-hpgl',
 'hqx': 'application/x-mac-binhex40',
 'hta': 'application/hta',
 'htc': 'text/x-component',
 'htm': 'text/html',
 'html': 'text/html',
 'htmls': 'text/html',
 'htt': 'text/webviewhtml',
 'htx': 'text/html',
 'ice': 'x-conference/x-cooltalk',
 'ico': 'image/x-icon',
 'idc': 'text/plain',
 'ief': 'image/ief',
 'iefs': 'image/ief',
 'iges': 'model/iges',
 'igs': 'model/iges',
 'ima': 'application/x-ima',
 'imap': 'application/x-httpd-imap',
 'inf': 'application/inf',
 'ins': 'application/x-internett-signup',
 'ip': 'application/x-ip2',
 'isu': 'video/x-isvideo',
 'it': 'audio/it',
 'iv': 'application/x-inventor',
 'ivr': 'i-world/i-vrml',
 'ivy': 'application/x-livescreen',
 'jam': 'audio/x-jam',
 'jav': 'text/x-java-source',
 'java': 'text/x-java-source',
 'jcm': 'application/x-java-commerce',
 'jfif': 'image/pjpeg',
 'jfif-tbnl': 'image/jpeg',
 'jpe': 'image/pjpeg',
 'jpeg': 'image/pjpeg',
 'jpg': 'image/pjpeg',
 'jps': 'image/x-jps',
 'json': 'application/json',
 'js': 'text/ecmascript',
 'jut': 'image/jutvision',
 'kar': 'music/x-karaoke',
 'ksh': 'text/x-script.ksh',
 'la': 'audio/x-nspaudio',
 'lam': 'audio/x-liveaudio',
 'latex': 'application/x-latex',
 'lha': 'application/x-lha',
 'lhx': 'application/octet-stream',
 'list': 'text/plain',
 'lma': 'audio/x-nspaudio',
 'log': 'text/plain',
 'lsp': 'text/x-script.lisp',
 'lst': 'text/plain',
 'lsx': 'text/x-la-asf',
 'ltx': 'application/x-latex',
 'lzh': 'application/x-lzh',
 'lzx': 'application/x-lzx',
 'm': 'text/x-m',
 'm1v': 'video/mpeg',
 'm2a': 'audio/mpeg',
 'm2v': 'video/mpeg',
 'm3u': 'audio/x-mpequrl',
 'man': 'application/x-troff-man',
 'map': 'application/x-navimap',
 'mar': 'text/plain',
 'mbd': 'application/mbedlet',
 'mc$': 'application/x-magic-cap-package-1.0',
 'mcd': 'application/x-mathcad',
 'mcf': 'text/mcf',
 'mcp': 'application/netmc',
 'me': 'application/x-troff-me',
 'mht': 'message/rfc822',
 'mhtml': 'message/rfc822',
 'mid': 'x-music/x-midi',
 'midi': 'x-music/x-midi',
 'mif': 'application/x-mif',
 'mime': 'www/mime',
 'mjf': 'audio/x-vnd.audioexplosion.mjuicemediafile',
 'mjpg': 'video/x-motion-jpeg',
 'mm': 'application/x-meme',
 'mme': 'application/base64',
 'mod': 'audio/x-mod',
 'moov': 'video/quicktime',
 'mov': 'video/quicktime',
 'movie': 'video/x-sgi-movie',
 'mp2': 'video/x-mpeq2a',
 'mp3': 'video/x-mpeg',
 'mpa': 'video/mpeg',
 'mpc': 'application/x-project',
 'mpe': 'video/mpeg',
 'mpeg': 'video/mpeg',
 'mpg': 'video/mpeg',
 'mpga': 'audio/mpeg',
 'mpp': 'application/vnd.ms-project',
 'mpt': 'application/x-project',
 'mpv': 'application/x-project',
 'mpx': 'application/x-project',
 'mrc': 'application/marc',
 'ms': 'application/x-troff-ms',
 'mv': 'video/x-sgi-movie',
 'my': 'audio/make',
 'mzz': 'application/x-vnd.audioexplosion.mzz',
 'nap': 'image/naplps',
 'naplps': 'image/naplps',
 'nc': 'application/x-netcdf',
 'ncm': 'application/vnd.nokia.configuration-message',
 'nif': 'image/x-niff',
 'niff': 'image/x-niff',
 'nix': 'application/x-mix-transfer',
 'nsc': 'application/x-conference',
 'nvd': 'application/x-navidoc',
 'o': 'application/octet-stream',
 'oda': 'application/oda',
 'omc': 'application/x-omc',
 'omcd': 'application/x-omcdatamaker',
 'omcr': 'application/x-omcregerator',
 'p': 'text/x-pascal',
 'p10': 'application/x-pkcs10',
 'p12': 'application/x-pkcs12',
 'p7a': 'application/x-pkcs7-signature',
 'p7c': 'application/x-pkcs7-mime',
 'p7m': 'application/x-pkcs7-mime',
 'p7r': 'application/x-pkcs7-certreqresp',
 'p7s': 'application/pkcs7-signature',
 'part': 'application/pro_eng',
 'pas': 'text/pascal',
 'pbm': 'image/x-portable-bitmap',
 'pcl': 'application/x-pcl',
 'pct': 'image/x-pict',
 'pcx': 'image/x-pcx',
 'pd': 'chemical/x-pd',
 'pdf': 'application/pdf',
 'pfunk': 'audio/make.my.funk',
 'pgm': 'image/x-portable-greymap',
 'pic': 'image/pict',
 'pict': 'image/pict',
 'pkg': 'application/x-newton-compatible-pkg',
 'pko': 'application/vnd.ms-pki.pko',
 'pl': 'text/x-script.perl',
 'plx': 'application/x-pixclscript',
 'pm': 'text/x-script.perl-module',
 'pm4': 'application/x-pagemaker',
 'pm5': 'application/x-pagemaker',
 'png': 'image/png',
 'pnm': 'image/x-portable-anymap',
 'pot': 'application/vnd.ms-powerpoint',
 'pov': 'model/x-pov',
 'ppa': 'application/vnd.ms-powerpoint',
 'ppm': 'image/x-portable-pixmap',
 'pps': 'application/vnd.ms-powerpoint',
 'ppt': 'application/x-mspowerpoint',
 'ppz': 'application/mspowerpoint',
 'pre': 'application/x-freelance',
 'prt': 'application/pro_eng',
 'ps': 'application/postscript',
 'psd': 'application/octet-stream',
 'pvu': 'paleovu/x-pv',
 'pwz': 'application/vnd.ms-powerpoint',
 'py': 'text/x-script.phyton',
 'pyc': 'application/x-bytecode.python',
 'qcp': 'audio/vnd.qcelp',
 'qd3': 'x-world/x-3dmf',
 'qd3d': 'x-world/x-3dmf',
 'qif': 'image/x-quicktime',
 'qt': 'video/quicktime',
 'qtc': 'video/x-qtc',
 'qti': 'image/x-quicktime',
 'qtif': 'image/x-quicktime',
 'ra': 'audio/x-realaudio',
 'ram': 'audio/x-pn-realaudio',
 'ras': 'image/x-cmu-raster',
 'rast': 'image/cmu-raster',
 'rexx': 'text/x-script.rexx',
 'rf': 'image/vnd.rn-realflash',
 'rg': 'image/x-rg',
 'rm': 'audio/x-pn-realaudio',
 'rmi': 'audio/mid',
 'rmm': 'audio/x-pn-realaudio',
 'rmp': 'audio/x-pn-realaudio-plugin',
 'rng': 'application/vnd.nokia.ringing-tone',
 'rnx': 'application/vnd.rn-realplayer',
 'roff': 'application/x-troff',
 'rp': 'image/vnd.rn-realpix',
 'rpm': 'audio/x-pn-realaudio-plugin',
 'rt': 'text/vnd.rn-realtext',
 'rtf': 'text/richtext',
 'rtx': 'text/richtext',
 'rv': 'video/vnd.rn-realvideo',
 's': 'text/x-asm',
 's3m': 'audio/s3m',
 'saveme': 'application/octet-stream',
 'sbk': 'application/x-tbook',
 'scm': 'video/x-scm',
 'sdml': 'text/plain',
 'sdp': 'application/x-sdp',
 'sdr': 'application/sounder',
 'sea': 'application/x-sea',
 'set': 'application/set',
 'sgm': 'text/x-sgml',
 'sgml': 'text/x-sgml',
 'sh': 'text/x-script.sh',
 'shar': 'application/x-shar',
 'shtml': 'text/x-server-parsed-html',
 'sid': 'audio/x-psid',
 'sit': 'application/x-stuffit',
 'skd': 'application/x-koan',
 'skm': 'application/x-koan',
 'skp': 'application/x-koan',
 'skt': 'application/x-koan',
 'sl': 'application/x-seelogo',
 'smi': 'application/smil',
 'smil': 'application/smil',
 'snd': 'audio/x-adpcm',
 'sol': 'application/solids',
 'spc': 'text/x-speech',
 'spl': 'application/futuresplash',
 'spr': 'application/x-sprite',
 'sprite': 'application/x-sprite',
 'src': 'application/x-wais-source',
 'ssi': 'text/x-server-parsed-html',
 'ssm': 'application/streamingmedia',
 'sst': 'application/vnd.ms-pki.certstore',
 'step': 'application/step',
 'stl': 'application/x-navistyle',
 'stp': 'application/step',
 'sv4cpio': 'application/x-sv4cpio',
 'sv4crc': 'application/x-sv4crc',
 'svf': 'image/x-dwg',
 'svr': 'x-world/x-svr',
 'swf': 'application/x-shockwave-flash',
 't': 'application/x-troff',
 'talk': 'text/x-speech',
 'tar': 'application/x-tar',
 'tbk': 'application/x-tbook',
 'tcl': 'text/x-script.tcl',
 'tcsh': 'text/x-script.tcsh',
 'tex': 'application/x-tex',
 'texi': 'application/x-texinfo',
 'texinfo': 'application/x-texinfo',
 'text': 'text/plain',
 'tgz': 'application/x-compressed',
 'tif': 'image/x-tiff',
 'tiff': 'image/x-tiff',
 'tr': 'application/x-troff',
 'tsi': 'audio/tsp-audio',
 'tsp': 'audio/tsplayer',
 'tsv': 'text/tab-separated-values',
 'turbot': 'image/florian',
 'txt': 'text/plain',
 'uil': 'text/x-uil',
 'uni': 'text/uri-list',
 'unis': 'text/uri-list',
 'unv': 'application/i-deas',
 'uri': 'text/uri-list',
 'uris': 'text/uri-list',
 'ustar': 'multipart/x-ustar',
 'uu': 'text/x-uuencode',
 'uue': 'text/x-uuencode',
 'vcd': 'application/x-cdlink',
 'vcs': 'text/x-vcalendar',
 'vda': 'application/vda',
 'vdo': 'video/vdo',
 'vew': 'application/groupwise',
 'viv': 'video/vnd.vivo',
 'vivo': 'video/vnd.vivo',
 'vmd': 'application/vocaltec-media-desc',
 'vmf': 'application/vocaltec-media-file',
 'voc': 'audio/x-voc',
 'vos': 'video/vosaic',
 'vox': 'audio/voxware',
 'vqe': 'audio/x-twinvq-plugin',
 'vqf': 'audio/x-twinvq',
 'vql': 'audio/x-twinvq-plugin',
 'vrml': 'x-world/x-vrml',
 'vrt': 'x-world/x-vrt',
 'vsd': 'application/x-visio',
 'vst': 'application/x-visio',
 'vsw': 'application/x-visio',
 'w60': 'application/wordperfect6.0',
 'w61': 'application/wordperfect6.1',
 'w6w': 'application/msword',
 'wav': 'audio/x-wav',
 'wb1': 'application/x-qpro',
 'wbmp': 'image/vnd.wap.wbmp',
 'we': 'application/vnd.xara',
 'wiz': 'application/msword',
 'wk1': 'application/x-123',
 'wmf': 'windows/metafile',
 'wml': 'text/vnd.wap.wml',
 'wmlc': 'application/vnd.wap.wmlc',
 'wmls': 'text/vnd.wap.wmlscript',
 'wmlsc': 'application/vnd.wap.wmlscriptc',
 'word': 'application/msword',
 'wp': 'application/wordperfect',
 'wp5': 'application/wordperfect6.0',
 'wp6': 'application/wordperfect',
 'wpd': 'application/x-wpwin',
 'wq1': 'application/x-lotus',
 'wri': 'application/x-wri',
 'wrl': 'x-world/x-vrml',
 'wrz': 'x-world/x-vrml',
 'wsc': 'text/scriplet',
 'wsrc': 'application/x-wais-source',
 'wtk': 'application/x-wintalk',
 'xbm': 'image/xbm',
 'xdr': 'video/x-amt-demorun',
 'xgz': 'xgl/drawing',
 'xif': 'image/vnd.xiff',
 'xl': 'application/excel',
 'xla': 'application/x-msexcel',
 'xl': 'application/x-excel',
 'xlc': 'application/x-excel',
 'xld': 'application/x-excel',
 'xlk': 'application/x-excel',
 'xll': 'application/x-excel',
 'xlm': 'application/x-excel',
 'xls': 'application/x-msexcel',
 'xlt': 'application/x-excel',
 'xlv': 'application/x-excel',
 'xlw': 'application/x-msexcel',
 'xm': 'audio/xm',
 'xml': 'text/xml',
 'xmz': 'xgl/movie',
 'xpix': 'application/x-vnd.ls-xpix',
 'xpm': 'image/xpm',
 'x-png': 'image/png',
 'xsr': 'video/x-amt-showrun',
 'xwd': 'image/x-xwindowdump',
 'xyz': 'chemical/x-pd',
 'z': 'application/x-compressed',
 'zip': 'multipart/x-zip',
 'zoo': 'application/octet-stream',
 'zsh': 'text/x-script.zsh'
}

status_messages = {
    100: "Continue",
    101: "Switching Protocol",
    102: "Processing",
    103: "Early Hints",
    200: "OK",
    201: "Created",
    202: "Accepted",
    203: "Non",
    204: "No Content",
    205: "Reset Content",
    206: "Partial Content",
    207: "Multi",
    208: "Already Reported",
    226: "IM Used",
    300: "Multiple Choice",
    300: "Multiple Choices",
    301: "Moved Permanently",
    302: "Found",
    303: "See Other",
    304: "Not Modified",
    305: "Use Proxy",
    307: "Temporary Redirect",
    308: "Permanent Redirect",
    400: "Bad Request",
    401: "Unauthorized",
    402: "Payment Required",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    406: "Not Acceptable",
    407: "Proxy Authentication Required",
    408: "Request Timeout",
    409: "Conflict",
    410: "Gone",
    411: "Length Required",
    412: "Precondition Failed",
    413: "Payload Too Large",
    414: "URI Too Long",
    415: "Unsupported Media Type",
    416: "Range Not Satisfiable",
    417: "Expectation Failed",
    418: "I'm a teapot",
    421: "Misdirected Request",
    422: "Unprocessable Entity",
    423: "Locked",
    424: "Failed Dependency",
    425: "Too Early",
    426: "Upgrade Required",
    428: "Precondition Required",
    429: "Too Many Requests",
    431: "Request Header Fields Too Large",
    451: "Unavailable For Legal Reasons",
    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
    505: "HTTP Version Not Supported",
    506: "Variant Also Negotiates",
    507: "Insufficient Storage",
    508: "Loop Detected",
    510: "Not Extended",
    511: "Network Authentication Required",
    "Continue": 100,
    "Switching Protocol": 101,
    "Switching Protocols": 101,
    "Processing": 102,
    "Early Hints": 103,
    "OK": 200,
    "Created": 201,
    "Accepted": 202,
    "Non": 203,
    "No Content": 204,
    "Reset Content": 205,
    "Partial Content": 206,
    "Multi": 207,
    "Already Reported": 208,
    "IM Used": 226,
    "Multiple Choice": 300,
    "Multiple Choices": 300,
    "Moved Permanently": 301,
    "Found": 302,
    "See Other": 303,
    "Not Modified": 304,
    "Use Proxy": 305,
    "Temporary Redirect": 307,
    "Permanent Redirect": 308,
    "Bad Request": 400,
    "Unauthorized": 401,
    "Payment Required": 402,
    "Forbidden": 403,
    "Not Found": 404,
    "Method Not Allowed": 405,
    "Not Acceptable": 406,
    "Proxy Authentication Required": 407,
    "Request Timeout": 408,
    "Conflict": 409,
    "Gone": 410,
    "Length Required": 411,
    "Precondition Failed": 412,
    "Payload Too Large": 413,
    "URI Too Long": 414,
    "Unsupported Media Type": 415,
    "Range Not Satisfiable": 416,
    "Expectation Failed": 417,
    "I'm a teapot": 418,
    "Misdirected Request": 421,
    "Unprocessable Entity": 422,
    "Locked": 423,
    "Failed Dependency": 424,
    "Too Early": 425,
    "Upgrade Required": 426,
    "Precondition Required": 428,
    "Too Many Requests": 429,
    "HTTP": 430,
    "Request Header Fields Too Large": 431,
    "Unavailable For Legal Reasons": 451,
    "Internal Server Error": 500,
    "Not Implemented": 501,
    "Bad Gateway": 502,
    "Service Unavailable": 503,
    "Gateway Timeout": 504,
    "HTTP Version Not Supported": 505,
    "Variant Also Negotiates": 506,
    "Insufficient Storage": 507,
    "Loop Detected": 508,
    "Not Extended": 510,
    "Network Authentication Required": 511,
}


def www_authenticate(auth_type: str, realm: str = "Description") -> str:
    """WWW-Authenticate   
    Header-Type : response
        The HTTP WWW-Authenticate response header defines the authentication method that should 
    be used to gain access to a resource.

    auth_type : Basic | Bearer | Diges | HOBA | AWS4-HMAC-SHA256
    realm     : str

    https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate
    """
    return {
        "name": "WWW-Authenticate",
        "value": f"""{auth_type} realm="{realm}", charset=\"UTF-8\""""
    }


def accept_ch_lifetime(age: int, *args, **kwargs) -> str:
    """Accept-CH-Lifetime
    Header-Type : response
        The Accept-CH-Lifetime header is set by the server to specify the persistence of Accept-CH 
    header value that specifies for which Client Hints headers 
    client should include in subsequent requests.

    age : int
    """
    return {
        "name": "Accept-CH-Lifetime",
        "value": age
    }


def accept_ch(hints: str, *args, **kwargs) -> str:
    """Accept-CH
    Header-Type : response
        The Accept-CH header is set by the server to specify which Client Hints headers a client 
    should include in subsequent requests.

    hints : str

    Example 

    Accept-CH: Viewport-Width
    Accept-CH: Width
    Accept-CH-Lifetime: 86400
    Vary: Viewport-Width, Width

    https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-CH
    """
    return {
        "name": "Accept-CH",
        "value": hints
    }


def accept_charset(charset: str = 'utf-8', *args, **kwargs) -> str:
    """Accept-Charset
    Header-Type : request
        The Accept-Charset request HTTP header was a header that advertised 
    a client's supported character encodings. It is no longer widely used.

    charset : str

    example

    Accept-Charset : utf-8

    https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Charset
    """
    return {
        "name": "Accept-Charset",
        "value": charset
    }


def accept_encoding(encoding: str = "*", *args, **kwargs) -> str:
    """Accept-Encoding
    Header-Type : request
        The Accept-Encoding request HTTP header advertises which content encoding, usually a 
    compression algorithm, the client is able to understand. Using content negotiation, the 
    server selects one of the proposals, uses it and informs the client of its choice with 
    the Content-Encoding response header.

    encoding : gzip | compress | deflate | br | identity | *

    Example

    ```
    Accept-Encoding: gzip
    Accept-Encoding: compress
    Accept-Encoding: deflate
    Accept-Encoding: br
    Accept-Encoding: identity
    Accept-Encoding: *
    ```

    https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding
    """
    return {
        "name": "Accept-Encoding",
        "value": encoding
    }


def access_control_allow_origin(origin: str = "*", *args, **kwargs) -> str:
    """Access-Control-Allow-Origin
    Header-Type : response
        The Access-Control-Allow-Origin response header indicates whether the response can be 
    shared with requesting code from the given origin.

    origin : * | URI | URL

    Example
    ```
    Access-Control-Allow-Origin: *
    ```
    https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin
    """
    return {
        "name": "Access-Control-Allow-Origin",
        "value": origin
    }


def access_control_allow_credentials(allow: str = "true", *args, **kwargs) -> str:
    """Access-Control-Allow-Credentials
    Header-Type : response
        The Access-Control-Allow-Credentials response header tells browsers whether to expose 
    the response to frontend JavaScript code when the request's credentials mode (Request.credentials) 
    is include.

    allow : true | false

    https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials
    """
    return {
        "name": "Access-Control-Allow-Credentials",
        "value": allow
    }


def access_control_allow_methods(methods: list = ["GET", "POST", "PUT", "DELETE", "OPTIONS"], *args, **kwargs) -> str:
    """Access-Control-Allow-Methods
    Header-Type : response
        The Access-Control-Allow-Methods response header specifies the method or methods allowed when 
    accessing the resource in response to a preflight request.

    methods : GET | POST | DELETE | PUT | OPTIONS

    https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods
    """
    return {
        "name": "Access-Control-Allow-Methods",
        "value": ', '.join(methods)
    }


def access_control_allow_headers(headers: list = ["*"], *args, **kwargs) -> str:
    """Access-Control-Allow-Headers
    Header-Type : response
        The Access-Control-Expose-Headers response header allows a server to indicate which response headers 
    should be made available to scripts running in the browser, in response to a cross-origin request.

    headers : header-names

    https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers
    """
    return {
        "name": "Access-Control-Allow-Headers",
        "value": ', '.join(headers) if len(headers) > 1 else headers[0]
    }


def access_control_max_age(max_age: int = 5, *args, **kwargs) -> str:
    """Access-Control-Max-Age
    Header-Type : response
        The Access-Control-Max-Age response header indicates how long the results of a preflight request 
    (that is the information contained in the Access-Control-Allow-Methods and Access-Control-Allow-Headers headers) 
    can be cached.

    max_age : int ( seconds )

    https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Max-Age
    """
    return {
        "name": "Access-Control-Max-Age",
        "value": max_age
    }


def content_encoding(encoding: str = "gzip", *args, **kwargs) -> str:
    """Content-Encoding
    Header-Type : rest
        The Content-Encoding entity header is used to compress the media-type. When present, 
    its value indicates which encodings were applied to the entity-body. It lets the client 
    know how to decode in order to obtain the media-type referenced by the Content-Type header.

    encoding : gzip | compress | deflate | br

    Example 

    ```
    Content-Encoding: gzip
    Content-Encoding: compress
    Content-Encoding: deflate
    Content-Encoding: br
    ```
    """
    return {
        "name": "Content-Encoding",
        "value": encoding
    }


def content_length(length: int, *args, **kwargs) -> str:
    """Content-Length
    Header-Type : general
        The Content-Length entity header indicates the size of the entity-body, in bytes, sent to the recipient.

    https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Length
    """
    return {
        "name": "Content-Length",
        "value": length
    }


def connection(state: str = 'keep-alive', *args, **kwargs) -> str:
    """Connection
    Header-Type : general
        The Connection general header controls whether or not the network connection stays open 
    after the current transaction finishes. If the value sent is keep-alive, the connection is 
    persistent and not closed, allowing for subsequent requests to the same server to be done.

    state : keep-alive | close

    Example

    ```
    Connection: keep-alive
    Connection: close
    ```
    https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Connection
    """
    return {
        "name": "Connection",
        "value": state
    }


def content_type(ctype: str = 'text', charset:str="charset=UTF-8", *args, **kwargs) -> str:
    """Content-Type
    Header-Type : rest
        In responses, a Content-Type header tells the client what the content type of the returned 
    content actually is. Browsers will do MIME sniffing in some cases and will not necessarily 
    follow the value of this header; to prevent this behavior, the header X-Content-Type-Options 
    can be set to nosniff.

    ctype : application/x-www-form-urlencoded | multipart/form-data | text/plain | application/json

    for more types see mime-types

    Example 

    ```
    Content-Type: text/html; charset=UTF-8
    ```
    https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
    """
    try:
        return {
            "name": "Content-Type",
            "value": f"{mime_types.get(ctype)}, {charset}"
        }
    except KeyError:
        return {
            "name": "Content-Type",
            "value": f"text/plain, {charset}"
        }

def content_disposition(filename:str, disposition:str='attachment',*args, **kwargs) -> str:
    """Content-Disposition
    Header-Type : general
        In a regular HTTP response, the Content-Disposition response header is a header indicating if 
    the content is expected to be displayed inline in the browser, that is, as a Web page or as part 
    of a Web page, or as an attachment, that is downloaded and saved locally.

    filename : str
    disposition : attachment | inline | form-data

    https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition
    """
    return {
        "name": "Content-Disposition",
        "value": f"{disposition}; {filename}"
    }

def etag(tag: str = "Ask server admin to generate eTag.", *args, **kwargs) -> str:
    """Etag
    Header-Type : response
        The ETag HTTP response header is an identifier for a specific version of a resource. It lets 
    caches be more efficient and save bandwidth, as a web server does not need to resend a full 
    response if the content has not changed. Additionally, etags help prevent simultaneous updates of 
    a resource from overwriting each other ("mid-air collisions").

    https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag
    """
    return {
        "name": "ETag",
        "value": f'"{tag}"'
    }


def keep_alive(timeout: int = 5, maxt: int = 1000, *args, **kwargs) -> str:
    """Keep-Alive
    Header-Type : general
        The Keep-Alive general header allows the sender to hint about how the connection may be used to 
    set a timeout and a maximum amount of requests.

    https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Keep-Alive
    """
    return {
        "name": "Keep-Alive",
        "value": f"timeout={timeout}, max={maxt}"
    }


def location(url:str,*args, **kwargs) -> str:
    """Location
    Header-Type : response
        The Location response header indicates the URL to redirect a page to. It only provides a meaning 
    when served with a 3xx (redirection) or 201 (created) status response.

        In cases of redirection, the HTTP method used to make the new request to fetch the page pointed 
    to by Location depends of the original method and of the kind of redirection:

    > 303 (See Also) responses always lead to the use of a GET method, 
    > 307 (Temporary Redirect) and 308 (Permanent Redirect) don't change the method used in the original request;
    > 301 (Moved Permanently) and 302 (Found) doesn't change the method most of the time, though older user-agents 
     may (so you basically don't know).

     url : str
    """
    return {
        "name": "Location",
        "value": url
    }


def server(name: str = 'Pyrex', *args, **kwargs) -> str:
    """Server
    Header-Type : response
        The Server header describes the software used by the origin server that handled the request — that 
    is, the server that generated the response.

    https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server
    """
    return {
        "name": "Server",
        "value": name
    }


def set_cookie(cookie: str, *args, **kwargs) -> str:
    """Set-Cookie
    Header-Type : response

    https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
    """
    return {
        "name": "Set-Cookie",
        "value": cookie
    }


def sec_websocket_accept(key: str, *args, **kwargs) -> str:
    """Sec-WebSocket-Accept
    Header-Type : response

        The Sec-WebSocket-Accept header is used in the websocket opening handshake. It would appear 
    in the response headers. That is, this is header is sent from server to client to inform that 
    server is willing to initiate a websocket connection.

    https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-WebSocket-Accept
    """
    return {
        "name": "Sec-WebSocket-Accept",
        "value": key
    }

def transfer_encoding(encoding: str = "chunked", *args, **kwargs) -> str:
    """Transfer-Encoding
    Header-Type : general
        The Transfer-Encoding header specifies the form of encoding used to safely transfer 
    the payload body to the user.

    encoding: chunked | compress | deflate | gzip | identity

    https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding
    """
    return {
        "name": "Transfer-Encoding",
        "value": encoding
    }

def upgrade(name: str)->str:
    """Upgrade
    Header-Type : response
        The HTTP 1.1 (only) Upgrade header can be used to upgrade an already established 
    client/server connection to a different protocol (over the same transport protocol). 
    For example, it can be used by a client to upgrade a connection from HTTP 1.1 to HTTP 2.0, 
    or an HTTP or HTTPS connection into a WebSocket.

    https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Upgrade
    """
    return {
        "name": "Upgrade",
        "value": name
    }


def vary(variables: list = ['*'], *args, **kwargs) -> str:
    """Vary
    Header-Type : response
        The Vary HTTP response header determines how to match future request headers to decide 
    whether a cached response can be used rather than requesting a fresh one from the origin server. 
    It is used by the server to indicate which headers it used when selecting a representation of 
    a resource in a content negotiation algorithm.


    https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary
    """
    return {
        "name": "Vary",
        "value": variables[0] if len(variables) == 1 else ', '.join(variables)
    }


def x_frame_options(value: str = 'SAMEORIGIN', *args, **kwargs) -> str:
    """X-Frame-Options
    Header-Type : response|request|general|rest
        The X-Frame-Options HTTP response header can be used to indicate whether or not a browser should be allowed to 
    render a page in a <frame>, <iframe>, <embed> or <object>. Sites can use this to avoid click-jacking attacks, by 
    ensuring that their content is not embedded into other sites.

    value : DENY | SAMEORIGIN

    https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
    """
    return {
        "name": "X-Frame-Options",
        "value": value
    }


def abc_field(*args, **kwargs) -> str:
    """FieldName
    Header-Type : response|request|general|rest
    """
    return {
        "name": "FieldName",
        "value": "Formatted Value"
    }


class Cookies(object):
    """Cookies object is as a cookie storage for session. 
    """
    def __init__(self, string: str = ""):
        self.string = string

    def __repr__(self, ):
        c = [f"{val['name']}," for _, val in self.__dict__.items()
             if isinstance(val, dict)]
        c = '\n\t'.join(c)
        return f"CookieStorage({{\n\t{c}\n}})"

    def __getitem__(self, cookie: str) -> str:
        return self.__dict__[cookie]['value']

    def parse(self, request):
        self.string = request.cookie['value']
        for cookie in self.string.split("; "):
            name, *value = cookie.split("=")
            value = "=".join(value)
            self.__dict__[name.lower().replace("-", "_")] = {
                "name": name,
                "value": value
            }
        return self

    def encode(self, ) -> str:
        self.string = ''
        for key, val in self.__dict__.items():
            if isinstance(val, dict):
                self.string += f"{val['name']}={val['value']}; "
        return self.string[:-1]


class ResponseHeader(object):
    """ResponseHeader implements the HTTP response header to create standard response header.
    It can be used to create standard response headers to be used by web server object. 
    
    example:
    
        # To Create a response header
        header = ResponseHeader()
        
        # add response code
        header = header | code # eg. 100, 101, 200, 404

        # update header
        header += content_length(128)

        # or
        header.update(
            content_length(128),
            connection("keep-alive")
        )

        # attach data
        header @ byte_string

    CHANGELOG:
        1.0.0 :
            added response header
    """
    protocol = "HTTP/1.0"
    status_code = None
    status_message = None

    def __init__(self,):
        pass

    def __repr__(self,) -> str:
        return f"""ResponseHeader(
    protocol = {self.protocol},
    status_code = {self.status_code},
    status_message = {self.status_message}
)"""

    def __str__(self,) -> str:
        return self.__repr__()

    def __getitem__(self, item: str):
        return self.__dict__[item]['value']

    def __setitem__(self, item: str, value):
        self.__dict__[item.lower().replace(
            "-", "_")] = {"name": item, "value": value}

    def __iadd__(self, field: dict):
        self.__dict__[field['name'].lower().replace("-", "_")] = field
        return self

    def __or__(self, status):
        self.status_code = status
        self.status_message = status_messages[status]
        return self

    def __matmul__(self, data: str) -> bytes:
        return self.encode() + str(data).encode()

    def update(self, *fields):
        for field in fields:
            self += field

    def encode(self,) -> bytes:
        assert self.status_code != None, "Please provide status code."
        assert self.status_message != None, "Please provide status message"
        header = f"{self.protocol} {self.status_code} {self.status_message}\r\n"
        for key, val in self.__dict__.items():
            if isinstance(val, dict):
                header += f"{val['name']}: {val['value']}\r\n"
        return f"{header}\r\n".encode()


class RequestHeader(object):
    """RequestHeader implements standard HTTP request header protocol. It can be used by both
    server and client. Server can use it to parse incoming requests and client applications can
    use it to make requests to servers.

    example:
        # to parse incoming request
        header = RequestHeader().parse(header_string)

        # to make a request header
        header = RequestHeader()

         # update header
        header += content_length(128)

        # or
        header.update(
            content_length(128),
            connection("keep-alive")
        )

        # attach data
        header @ byte_string

    CHANGELOG:
        1.0.0:  
            added request header
    """
    def __init__(self,):
        pass

    def __repr__(self,) -> str:
        return f"""RequestHeader(\n    method="{self.method}",\n    path="{self.path}",\n)"""

    def __str__(self,) -> str:
        return self.__repr__()

    def __getitem__(self, item: str):
        return self.__dict__[item]['value']

    def __setitem__(self, item: str, value):
        self.__dict__[item.lower().replace("-", "_")] = {
            "name": item,
            "value": value
        }

    def __iadd__(self, field: dict):
        self.__dict__[field['name'].lower().replace("-", "_")] = field
        return self

    def parse(self, header_string: str):
        self.header_string = header_string

        header_fields: List[str] = header_string.split('\r\n')
        head, *header_fields = header_fields
        self.method, self.path, self.protocol = head.split(" ")
        for field in header_fields:
            if field:
                field, *value = field.split(": ")
                value = ":".join(value)
                self.__dict__[field.lower().replace("-", "_")] = {
                    "name": field,
                    "value": value,
                }
        if 'cookie' in self.__dict__:
            self.cookies = Cookies().parse(self, )
        return self

    def encode(self,) -> bytes:
        header = f"{self.method} {self.path} {self.protocol}\r\n"
        for key, val in self.__dict__.items():
            if isinstance(val, dict):
                header += f"{val['name']}: {val['value']}\r\n"
        return f"{header}\r\n".encode()
