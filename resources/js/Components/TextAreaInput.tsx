import { Textarea } from "@headlessui/react";

interface TextAreaInputProps {
    placeholder?: string;
    id?: string;
    rows?: number;
    value?: string;
    onChange?: (e: any) => void;
}

export default function TextAreaInput({
    placeholder,
    id,
    rows,
    value,
    onChange
}: TextAreaInputProps){
    return <>
    
        <Textarea 
            className={'border border-slate-200 rounded w-full'}
            placeholder={placeholder} 
            id={id}  
            rows={rows}
            value={value}
            onChange={onChange}
        >

        </Textarea>

    </>
}