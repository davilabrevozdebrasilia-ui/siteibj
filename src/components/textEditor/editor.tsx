"use client";

import React, { useCallback, useMemo, useState } from "react";
import { BaseEditor, createEditor, Descendant, Transforms, Editor, Text } from "slate";
import { Slate, Editable, withReact, ReactEditor, useSlate } from "slate-react";
import { withHistory } from "slate-history";
import { cn } from "@/lib/utils"; // Se tiver tailwind-utils, senão remova

type Props = {
    value: string;
    onChange: (html: string) => void;
};

type CustomElement = {
    type: "paragraph" | "alignment";
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
    return value.map(n => {
        if ('text' in n) return n.text;
        return serialize(n.children);
    }).join("");
}

function deserialize(value: string): Descendant[] {
    return [
        {
            type: 'paragraph',
            children: [{ text: value }],
        },
    ];
}

// Helpers
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

const toggleAlignment = (editor: Editor, align: "left" | "center" | "right") => {
    const [match] = Editor.nodes(editor, {
        match: n => !Editor.isEditor(n) && 'type' in n && n.type === "paragraph",
    });

    Transforms.setNodes(
        editor,
        { align },
        { match: n => !Editor.isEditor(n) && 'type' in n && n.type === "paragraph" }
    );
};

const ToolbarButton = ({ format, icon, onClick, active }: {
    format: string;
    icon: string;
    onClick: () => void;
    active?: boolean;
}) => (
    <button
        className={cn(
            "px-2 py-1 border rounded text-sm mx-1",
            active ? "bg-gray-800 text-white" : "bg-gray-200"
        )}
        onMouseDown={e => {
            e.preventDefault();
            onClick();
        }}
    >
        {icon}
    </button>
);

// Editor
export default function EditorComponent({ value, onChange }: Props) {
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);
    const [content, setContent] = useState<Descendant[]>(deserialize(value));

    const handleChange = useCallback((newValue: Descendant[]) => {
        setContent(newValue);
        onChange(serialize(newValue));
    }, [onChange]);

    return (
        <div className="border rounded bg-white p-2">
            <Slate editor={editor} initialValue={content} onChange={handleChange}>
                <div className="flex items-center mb-2 space-x-2">
                    <MarkButton format="bold" icon="B" />
                    <MarkButton format="italic" icon="I" />
                    <MarkButton format="underline" icon="U" />
                    <AlignButton align="left" icon="⯇" />
                    <AlignButton align="center" icon="≡" />
                    <AlignButton align="right" icon="⯈" />
                </div>
                <Editable
                    className="min-h-[120px]"
                    placeholder="Escreva o conteúdo da notícia aqui..."
                    renderLeaf={props => <Leaf {...props} />}
                    renderElement={props => <Element {...props} />}
                />
            </Slate>
        </div>
    );
}

// Botões de marcação
const MarkButton = ({ format, icon }: { format: keyof CustomText; icon: string }) => {
    const editor = useSlate();
    return (
        <ToolbarButton
            format={format}
            icon={icon}
            onClick={() => toggleMark(editor, format)}
            active={isMarkActive(editor, format)}
        />
    );
};

const AlignButton = ({ align, icon }: { align: "left" | "center" | "right"; icon: string }) => {
    const editor = useSlate();
    return (
        <ToolbarButton
            format={align}
            icon={icon}
            onClick={() => toggleAlignment(editor, align)}
        />
    );
};

// Render leaf com marcação de texto
const Leaf = ({ attributes, children, leaf }: any) => {
    if (leaf.bold) children = <strong>{children}</strong>;
    if (leaf.italic) children = <em>{children}</em>;
    if (leaf.underline) children = <u>{children}</u>;
    return <span {...attributes}>{children}</span>;
};

// Render element para alinhamento
const Element = ({ attributes, children, element }: any) => {
    const style = { textAlign: element.align || "left" };
    return <p {...attributes} style={style}>{children}</p>;
};
