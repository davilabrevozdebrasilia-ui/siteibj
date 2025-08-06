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
    type: "paragraph";
    align?: "left" | "center" | "right";
    children: CustomText[];
};

type CustomText = {
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
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
                return text;
            }

            if (!SlateElement.isElement(n)) return "";

            const children = serialize(n.children);
            const align = n.align ? ` style="text-align:${n.align}"` : "";

            switch (n.type) {
                case "paragraph":
                    return `<p${align}>${children}</p>`;
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
    return marks ? marks[format] === true : false;
};

const toggleMark = (editor: Editor, format: keyof CustomText) => {
    const isActive = isMarkActive(editor, format);
    if (isActive) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
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
                <div className="flex items-center mb-2 space-x-2 ">
                    <MarkButton format="bold" icon="B" />
                    <MarkButton format="italic" icon="I" />
                    <MarkButton format="underline" icon="U" />
                    <AlignButton align="left" icon="⯇" />
                    <AlignButton align="center" icon="≡" />
                    <AlignButton align="right" icon="⯈" />
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

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
    if (leaf.bold) children = <strong>{children}</strong>;
    if (leaf.italic) children = <em>{children}</em>;
    if (leaf.underline) children = <u>{children}</u>;
    return <span {...attributes}>{children}</span>;
};

const Element = ({ attributes, children, element }: RenderElementProps) => {
    const style = { textAlign: (element as CustomElement).align || "left" };
    return (
        <p {...attributes} style={style}>
            {children}
        </p>
    );
};
