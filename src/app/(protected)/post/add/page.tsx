"use client"
import {ChangeEvent, useState} from "react";

export default function PostAdd() {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            alert("file.lastModified = "+file.lastModified);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result as string);
            };
            reader.readAsDataURL(file);
            alert("imageSrc = "+imageSrc )
        }
    };
    return (
        <>

            <input type="file" accept="image/*" capture="environment" multiple onChange={handleFileChange}/>
            {imageSrc && <img id="preview" src={imageSrc} alt="Preview" />}

        </>
    );
}
