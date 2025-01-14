import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { storage } from "../firebase"; // Asegúrate de que este import esté correcto
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

// Configura el workerSrc usando la versión correcta de pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).href;

export function useFile() {
    const [url, setUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [generatedText, setGeneratedText] = useState('');
    const [loading, setLoading] = useState(false);
    const [storageRef, setStorageRef] = useState(null);

    useEffect(() => {
        const button = document.getElementsByTagName('button')[0];
        if (button) {
            if (!selectedFile || !url) {
                button.setAttribute('disabled', true);
            } else {
                button.removeAttribute('disabled');
            }
        }
    }, [selectedFile, url]);

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        await uploadFile(file);
    }, []);

    const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
        onDrop,
        accept: { 'application/pdf': [] }
    });

    const uploadFile = async (file) => {
        const storageReference  = ref(storage, `uploads/${file.name}`);
        setStorageRef(storageReference);

        try {
            await uploadBytes(storageReference, file);
            const downloadURL = await getDownloadURL(storageReference);
            setUrl(downloadURL);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const extractTextFromPDF = async (url) => {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
    
            // Carga el PDF
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
            let text = '';
    
            // Extrae texto de cada página
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                text += textContent.items.map(item => item.str).join(' ') + '\n';
            }

            if (storageRef) {
                await deleteObject(storageRef);
            } else {
                console.error('storageRef is null or undefined');
            }
            return text;
        } catch (error) {
            console.error('Error extracting text from PDF:', error);
            return 'Error extracting text from PDF';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const textoPdf = await extractTextFromPDF(url);
            const openai = createOpenAI({
                apiKey: import.meta.env.VITE_OPENAI_API_KEY,
                compatibility: 'strict'
              });

            const model = openai('gpt-4o');

            const { text } = await generateText({
                model: model,
                prompt: `Hazme un resumen de 3 lineas como mucho del siguiente texto, pero hazme el resumen en binario, recuerda 0 y 1 ya sabes: ${textoPdf}`
            });
            setGeneratedText(text)
        } catch (error) {
            console.error('Error generating text:', error);
        } finally {
            setLoading(false);
        }
    };

    return { getRootProps, getInputProps, handleSubmit, acceptedFiles, generatedText, loading };
}
