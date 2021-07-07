skip_attr = [
    '__module__',
    '__dict__',
    '__weakref__',
    '__doc__',
    '__repr__',
    '__hash__',
    '__str__',
    '__getattribute__',
    '__setattr__',
    '__delattr__',
    '__lt__',
    '__le__',
    '__eq__',
    '__ne__',
    '__gt__',
    '__ge__',
    '__init__',
    '__new__',
    '__reduce_ex__',
    '__reduce__',
    '__subclasshook__',
    '__init_subclass__',
    '__format__',
    '__sizeof__',
    '__dir__',
    '__class__',
    '__issheet__'
]

skip_attr = [
    '__module__',
    '__dict__',
    '__weakref__',
    '__doc__',
    '__repr__',
    '__hash__',
    '__str__',
    '__getattribute__',
    '__setattr__',
    '__delattr__',
    '__lt__',
    '__le__',
    '__eq__',
    '__ne__',
    '__gt__',
    '__ge__',
    '__init__',
    '__new__',
    '__reduce_ex__',
    '__reduce__',
    '__subclasshook__',
    '__init_subclass__',
    '__format__',
    '__sizeof__',
    '__dir__',
    '__class__'
]


class Style:
    align_content = None
    align_items = None
    align_self = None
    animation = None
    animation_delay = None
    animation_direction = None
    animation_duration = None
    animation_fill_mode = None
    animation_iteration_count = None
    animation_name = None
    animation_play_state = None
    animation_timing_function = None
    backface_visibility = None
    background = None
    background_attachment = None
    background_clip = None
    background_color = None
    background_image = None
    background_origin = None
    background_position = None
    background_repeat = None
    background_size = None
    border = None
    border_bottom = None
    border_bottom_color = None
    border_bottom_left_radius = None
    border_bottom_right_radius = None
    border_bottom_style = None
    border_bottom_width = None
    border_collapse = None
    border_color = None
    border_image = None
    border_image_outset = None
    border_image_repeat = None
    border_image_slice = None
    border_image_source = None
    border_image_width = None
    border_left = None
    border_left_color = None
    border_left_style = None
    border_left_width = None
    border_radius = None
    border_right = None
    border_right_color = None
    border_right_style = None
    border_right_width = None
    border_spacing = None
    border_style = None
    border_top = None
    border_top_color = None
    border_top_left_radius = None
    border_top_right_radius = None
    border_top_style = None
    border_top_width = None
    border_width = None
    bottom = None
    box_shadow = None
    box_sizing = None
    caption_side = None
    clear = None
    clip = None
    color = None
    column_count = None
    column_fill = None
    column_gap = None
    column_rule = None
    column_rule_color = None
    column_rule_style = None
    column_rule_width = None
    column_span = None
    column_width = None
    columns = None
    content = None
    counter_increment = None
    counter_reset = None
    cursor = None
    direction = None
    display = None
    empty_cells = None
    flex = None
    flex_basis = None
    flex_direction = None
    flex_flow = None
    flex_grow = None
    flex_shrink = None
    flex_wrap = None
    float = None
    font = None
    font_family = None
    font_size = None
    font_size_adjust = None
    font_stretch = None
    font_style = None
    font_variant = None
    font_weight = None
    height = None
    justify = None
    justify_content = None
    left = None
    letter_spacing = None
    line_height = None
    list_style = None
    list_style_image = None
    list_style_position = None
    list_style_type = None
    margin = None
    margin_bottom = None
    margin_left = None
    margin_right = None
    margin_top = None
    max_height = None
    max_width = None
    min_height = None
    min_width = None
    opacity = None
    order = None
    outline = None
    outline_color = None
    outline_offset = None
    outline_style = None
    outline_width = None
    overflow = None
    overflow_x = None
    overflow_y = None
    padding = None
    padding_bottom = None
    padding_left = None
    padding_right = None
    padding_top = None
    page_break_after = None
    page_break_before = None
    page_break_inside = None
    perspective = None
    perspective_origin = None
    position = None
    quotes = None
    resize = None
    right = None
    tab_size = None
    table_layout = None
    text_align = None
    text_align_last = None
    text_decoration = None
    text_decoration_color = None
    text_decoration_line = None
    text_decoration_style = None
    text_indent = None
    text_justify = None
    text_overflow = None
    text_shadow = None
    text_transform = None
    top = None
    transform = None
    transform_origin = None
    transform_style = None
    transition = None
    transition_delay = None
    transition_duration = None
    transition_property = None
    transition_timing_function = None
    vertical_align = None
    visibility = None
    white_space = None
    width = None
    word_break = None
    word_spacing = None
    word_wrap = None
    z_index = None

    __issheet__ = True

    def __init__(self, ):
        pass

    def __repr__(self, ) -> str:
        return self.__class__.__name__

    def __str__(self, parent=False) -> str:
        stylesheet = ""
        classname = f"{ parent if parent else ''} .{repr(self)}"
        for prop, value in self.__annotations__.items():
            stylesheet += f"{prop.replace('_','-')}: {value};"

        definition = f" {classname}{{{stylesheet}}}"
        for subclass in reversed(dir(self)):
            if not subclass.startswith("__"):
                subclass = getattr(self, subclass)
                if subclass is not None:
                    definition += subclass().__str__(parent=classname)
        return definition

def build(env: dict):
    stylesheet = str()
    for sheet in env.values():
        try:
            if sheet.__issheet__:
                sheet = sheet()
                if sheet.__class__.__name__ != 'Style':
                    stylesheet += str(sheet)
        except AttributeError as e: 
            ...
    env.update({
        "stylesheet": stylesheet
    })
