def attribute_classname(name: str, value: list) -> str:
    if isinstance(value, list):
        value = ' '.join([cls if isinstance(cls, str)
                          else repr(cls()) for cls in value])
    else:
        value = value if isinstance(value, str) else repr(value())
    return f"class='{value}'"


attribute_format = {
    "className": attribute_classname
}


def map_attribute(attribute: str, value: list) -> str:
    try:
        func = attribute_format[attribute]
        return func(attribute, value)
    except KeyError:
        return f"{attribute}={repr(value)}"


class Parent:
    _datadict = {}


class View(object):
    root = False
    parent = Parent()

    placeholders = {}
    datadict = {}

    def __init__(self, *children, **attr) -> None:
        self.children = children
        self.attr = attr

    def __str__(self, ) -> str:
        return "".join(map(str, self.children))

    def __repr__(self) -> str:
        return self.__str__()

    def __getitem__(self, key):
        return self.children[key]

    @property
    def attributes(self, ):
        attr = [map_attribute(key, val) for key, val in self.attr.items()]
        return " ".join(attr)


class Text(View):
    def __init__(self, text: str) -> None:
        super().__init__()
        self.text = str(text)

    def __str__(self):
        return self.text
# root


class html(View):
    def __init__(self, *children, **attr) -> None:
        super().__init__(*children, **attr)

    def __str__(self) -> str:
        return f"""<html>{super().__str__()}</html>"""

# meta data


class base(View):
    def __init__(self, *children, **attr) -> None:
        super().__init__(*children, **attr)

    def __str__(self) -> str:
        return super().__str__()


class head(View):
    def __init__(self, *children, **attr) -> None:
        super().__init__(*children, **attr)

    def __str__(self,):
        return f"""<head  {self.attributes}>{super().__str__()}</head>"""


class title(View):
    def __init__(self, title: str, **attr) -> None:
        super().__init__()
        self.title = title

    def __str__(self) -> str:
        return f"""<title>{self.title}</title>"""


class link:
    crossorigin: str = None
    disables: str = None
    href: str = None
    hreflang: str = None
    imagesizes: str = None
    imagesrcset: str = None
    integrity: str = None
    media: str = None
    prefetch: str = None
    referrerpolicy: str = None
    rel: str = None
    sizes: str = None
    title: str = None
    type: str = None

    def __init__(
        self,
        crossorigin: str = None,
        disables: str = None,
        href: str = None,
        hreflang: str = None,
        imagesizes: str = None,
        imagesrcset: str = None,
        integrity: str = None,
        media: str = None,
        prefetch: str = None,
        referrerpolicy: str = None,
        rel: str = None,
        sizes: str = None,
        title: str = None,
        type: str = None,
        **attr
    ) -> None:
        super().__init__()
        self.crossorigin = crossorigin
        self.disables = disables
        self.href = href
        self.hreflang = hreflang
        self.imagesizes = imagesizes
        self.imagesrcset = imagesrcset
        self.integrity = integrity
        self.media = media
        self.prefetch = prefetch
        self.referrerpolicy = referrerpolicy
        self.rel = rel
        self.sizes = sizes
        self.title = title
        self.type = type
        self.__dict__.update(attr)

    @property
    def attributes(self, ) -> str:
        return ' '.join(
            reversed([
                f"{key}={repr(val)}"
                for key, val
                in self.__dict__.items()
                if val is not None
            ])
        )

    def __repr__(self,) -> str:
        return str(self)

    def __str__(self) -> str:
        return f"""<link {self.attributes}/>"""


class stylesheet:
    def __init__(self, name: str) -> None:
        self.href = name

    def __repr__(self, ) -> str:
        return str(self)

    def __str__(self, ) -> str:
        return f"""<link rel="stylesheet" href="/static/css/{self.href}" />"""


class body(View):
    def __init__(self, *children, **attr) -> None:
        super().__init__(*children, **attr)

    def __str__(self):
        return f"""<body  {self.attributes}>{super().__str__()}</body>"""


class div(View):
    def __init__(self, *children, **attr) -> None:
        super().__init__(*children, **attr)

    def __str__(self):
        return f"""<div {self.attributes}>{super().__str__()}</div>"""


def build(env: dict):
    env.update({
        "views": {

        }
    })
    for name, view in env.items():
        if not name.startswith("__"):
            try:
                if view.__class__.__name__ in ( "html", "div", "section", "body"):
                    env['views'].update({
                        name: view
                    })
            except AttributeError:
                pass
