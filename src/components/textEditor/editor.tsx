"use client";

import React, { useCallback, useMemo, useState, useEffect } from "react";
import {
    BaseEditor,
    createEditor,
    Descendant,
    Transforms,
    Editor,
    Text,
    Element as SlateElement,
    Range,
} from "slate";
import {
    Slate,
    Editable,
    withReact,
    ReactEditor,
    useSlate,
    RenderLeafProps,
    RenderElementProps,
} from "slate-react";
import { withHistory } from "slate-history";
import { cn } from "@/lib/utils";

type Props = {
    value: string;
    onChange: (html: string) => void;
};

type CustomElement = {
    type: "paragraph" | "link";
    url?: string;
    align?: "left" | "center" | "right";
    children: CustomText[];
};

type CustomText = {
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    fontSize?: string;
    color?: string;
};

declare module "slate" {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor;
        Element: CustomElement;
        Text: CustomText;
    }
}

function serialize(value: Descendant[]): string {
    return value
        .map((n) => {
            if (Text.isText(n)) {
                let text = n.text;
                if (n.bold) text = `<strong>${text}</strong>`;
                if (n.italic) text = `<em>${text}</em>`;
                if (n.underline) text = `<u>${text}</u>`;

                const style: string[] = [];
                if (n.fontSize) style.push(`font-size:${n.fontSize}`);
                if (n.color) style.push(`color:${n.color}`);

                return style.length > 0
                    ? `<span style="${style.join(";")}">${text}</span>`
                    : text;
            }

            if (!SlateElement.isElement(n)) return "";

            const children = serialize(n.children);
            const align = n.align ? ` style="text-align:${n.align}"` : "";

            switch (n.type) {
                case "paragraph":
                    return `<p${align}>${children}</p>`;
                case "link":
                    return `<a href="${n.url}" target="_blank" rel="noopener noreferrer">${children}</a>`;
                default:
                    return children;
            }
        })
        .join("");
}

function deserialize(value: string): Descendant[] {
    return [
        {
            type: "paragraph",
            children: [{ text: value }],
        },
    ];
}

const isMarkActive = (editor: Editor, format: keyof CustomText) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] !== undefined : false;
};

const toggleMark = (editor: Editor, format: keyof CustomText, value?: any) => {
    const isActive = isMarkActive(editor, format);
    if (isActive && value === undefined) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, value ?? true);
    }
};

const isAlignmentActive = (
    editor: Editor,
    align: "left" | "center" | "right"
) => {
    const [match] = Editor.nodes(editor, {
        match: (n) =>
            !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "paragraph",
    });

    if (!match) return false;
    const [node] = match;
    return (node as CustomElement).align === align;
};

const toggleAlignment = (editor: Editor, align: "left" | "center" | "right") => {
    const isActive = isAlignmentActive(editor, align);

    Transforms.setNodes(
        editor,
        { align: isActive ? undefined : align },
        {
            match: (n) =>
                !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "paragraph",
        }
    );
};

const insertLink = (editor: Editor, url: string) => {
    if (!url) return;
    const { selection } = editor;
    const isCollapsed = selection && Range.isCollapsed(selection);

    const link: CustomElement = {
        type: "link",
        url,
        children: isCollapsed ? [{ text: url }] : [],
    };

    if (isCollapsed) {
        Transforms.insertNodes(editor, link);
    } else {
        Transforms.wrapNodes(editor, link, { split: true });
        Transforms.collapse(editor, { edge: "end" });
    }
};

const unwrapLink = (editor: Editor) => {
    Transforms.unwrapNodes(editor, {
        match: (n) => SlateElement.isElement(n) && n.type === "link",
    });
};

const ToolbarButton = ({
    icon,
    onClick,
    active,
}: {
    icon: string;
    onClick: () => void;
    active?: boolean;
}) => (
    <button
        className={cn(
            "px-2 py-1 border rounded text-sm mx-1 select-none cursor-pointer",
            active ? "bg-gray-800 text-white" : "bg-gray-200"
        )}
        onMouseDown={(e) => {
            e.preventDefault();
            onClick();
        }}
        type="button"
    >
        {icon}
    </button>
);

const MarkButton = ({ format, icon }: { format: keyof CustomText; icon: string }) => {
    const editor = useSlate();
    return (
        <ToolbarButton
            icon={icon}
            onClick={() => toggleMark(editor, format)}
            active={isMarkActive(editor, format)}
        />
    );
};

const AlignButton = ({
    align,
    icon,
}: {
    align: "left" | "center" | "right";
    icon: string;
}) => {
    const editor = useSlate();
    return (
        <ToolbarButton
            icon={icon}
            onClick={() => toggleAlignment(editor, align)}
            active={isAlignmentActive(editor, align)}
        />
    );
};

const FontSizeSelect = () => {
    const editor = useSlate();
    const sizes = [
        "10px", "12px", "14px", "16px", "18px", "20px",
        "22px", "24px", "28px", "32px", "36px", "40px", "48px", "56px", "64px"
    ];
    return (
        <select
            className="border rounded p-1 mx-1"
            onChange={(e) => toggleMark(editor, "fontSize", e.target.value)}
        >
            <option value="">Tamanho</option>
            {sizes.map((s) => (
                <option key={s} value={s}>
                    {s}
                </option>
            ))}
        </select>
    );
};

const ColorPicker = () => {
    const editor = useSlate();
    return (
        <input
            type="color"
            className="mx-1"
            onChange={(e) => toggleMark(editor, "color", e.target.value)}
        />
    );
};

const LinkButton = () => {
    const editor = useSlate();
    return (
        <>
            <ToolbarButton
                icon="🔗"
                onClick={() => {
                    const url = prompt("Insira a URL do link:");
                    if (url) insertLink(editor, url);
                }}
            />
            <ToolbarButton
                icon="❌"
                onClick={() => unwrapLink(editor)}
            />
        </>
    );
};

export default function EditorComponent({ value, onChange }: Props) {
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);
    const [content, setContent] = useState<Descendant[]>(() => deserialize(value));

    useEffect(() => {
        setContent(deserialize(value));
    }, [value]);

    const handleChange = useCallback(
        (newValue: Descendant[]) => {
            setContent(newValue);
            onChange(serialize(newValue));
        },
        [onChange]
    );

    return (
        <div className="border rounded-md bg-white p-2">
            <Slate editor={editor} initialValue={content} onChange={handleChange}>
                <div className="flex items-center mb-2 space-x-2">
                    <MarkButton format="bold" icon="B" />
                    <MarkButton format="italic" icon="I" />
                    <MarkButton format="underline" icon="U" />
                    <AlignButton align="left" icon="⯇" />
                    <AlignButton align="center" icon="≡" />
                    <AlignButton align="right" icon="⯈" />
                    <FontSizeSelect />
                    <ColorPicker />
                    <LinkButton />
                </div>
                <Editable
                    className="min-h-[120px] outline-none"
                    placeholder="Escreva o conteúdo da notícia aqui..."
                    renderLeaf={(props) => <Leaf {...props} />}
                    renderElement={(props) => <Element {...props} />}
                />
            </Slate>
        </div>
    );
}

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
    if (leaf.bold) children = <strong>{children}</strong>;
    if (leaf.italic) children = <em>{children}</em>;
    if (leaf.underline) children = <u>{children}</u>;

    const style: React.CSSProperties = {};
    if (leaf.fontSize) style.fontSize = leaf.fontSize;
    if (leaf.color) style.color = leaf.color;

    return (
        <span {...attributes} style={style}>
            {children}
        </span>
    );
};

const Element = ({ attributes, children, element }: RenderElementProps) => {
    if (element.type === "link") {
        return (
            <a
                {...attributes}
                href={element.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                {children}
            </a>
        );
    }

    const style = { textAlign: (element as CustomElement).align || "left" };
    return (
        <p {...attributes} style={style}>
            {children}
        </p>
    );
};
