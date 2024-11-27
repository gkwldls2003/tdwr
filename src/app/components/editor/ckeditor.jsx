import { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { useSession } from "next-auth/react";

import {
    ClassicEditor,
    AccessibilityHelp,
    Autoformat,
    AutoImage,
    Autosave,
    Bold,
    Essentials,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    Heading,
    ImageBlock,
    ImageCaption,
    ImageInline,
    ImageInsert,
    ImageInsertViaUrl,
    ImageResize,
    ImageStyle,
    ImageTextAlternative,
    ImageToolbar,
    ImageUpload,
    Italic,
    Link,
    LinkImage,
    MediaEmbed,
    Paragraph,
    PasteFromOffice,
    SelectAll,
    SimpleUploadAdapter,
    SourceEditing,
    Strikethrough,
    TextTransformation,
    Underline,
    Undo,
    GeneralHtmlSupport
} from 'ckeditor5';

import translations from 'ckeditor5/translations/ko.js';

import 'ckeditor5/ckeditor5.css';

/**
 * Please update the following values with your actual tokens.
 * Instructions on how to obtain them: https://ckeditor.com/docs/trial/latest/guides/real-time/quick-start.html
 */
export default function App({ data, setData, se }) {

    const [initialData, setInitialData] = useState();
    const { data: session } = useSession();
    const userInfo = session?.user.info;

    const [isLayoutReady, setIsLayoutReady] = useState(false);
    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setData(data);
    };

    useEffect(() => {
        if (data && se ==='U') { //수정할 때
            setIsLayoutReady(true);
            setInitialData(data);
            return () => setIsLayoutReady(false);
        } else if(se ==='C') { //작성할 때
            setIsLayoutReady(true);
            return () => setIsLayoutReady(false);
        }
    }, [data]);

    //이미지 업로드
    function uploadAdapter(loader) {
        return {
            upload: () => {
                return new Promise((resolve, reject) => {
                    const body = new FormData();
                    loader.file.then((file) => {
                        body.append('file', file);
                        body.append('user_id', userInfo?.user_id);

                        fetch('/api/file/ckEditorUpload', {
                            method: 'POST',
                            body: body
                        })
                            .then(res => res.json())
                            .then(response => {
                                if (response.success) {
                                    resolve({
                                        default: `/api/file/ckEditorDownload/` + response.stre_file_nm
                                    });
                                } else {
                                    alert(response.message);
                                    reject();
                                }

                            })
                            .catch(err => reject(err));
                    });
                });
            }
        };
    }

    function uploadPlugin(editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return uploadAdapter(loader);
        };
    }

    const editorConfig = {
        toolbar: {
            items: [
                'undo',
                'redo',
                '|',
                'sourceEditing',
                '|',
                'heading',
                '|',
                'fontSize',
                'fontFamily',
                'fontColor',
                'fontBackgroundColor',
                '|',
                'bold',
                'italic',
                'underline',
                'strikethrough',
                '|',
                'link',
                'insertImage',
                'mediaEmbed'
            ],
            shouldNotGroupWhenFull: false
        },
        plugins: [
            AccessibilityHelp,
            Autoformat,
            AutoImage,
            Autosave,
            Bold,
            Essentials,
            FontBackgroundColor,
            FontColor,
            FontFamily,
            FontSize,
            Heading,
            ImageBlock,
            ImageCaption,
            ImageInline,
            ImageInsert,
            ImageInsertViaUrl,
            ImageResize,
            ImageStyle,
            ImageTextAlternative,
            ImageToolbar,
            ImageUpload,
            Italic,
            Link,
            LinkImage,
            MediaEmbed,
            Paragraph,
            PasteFromOffice,
            SelectAll,
            SimpleUploadAdapter,
            SourceEditing,
            Strikethrough,
            TextTransformation,
            Underline,
            Undo,
            GeneralHtmlSupport
        ],
        htmlSupport: {
            allow: [
                {
                    name: /^(video|iframe)$/,
                    attributes: true,
                    classes: true,
                    styles: true
                }
            ]
        },
        fontFamily: {
            supportAllValues: true
        },
        fontSize: {
            options: [10, 12, 14, 'default', 18, 20, 22],
            supportAllValues: true
        },
        heading: {
            options: [
                {
                    model: 'paragraph',
                    title: 'Paragraph',
                    class: 'ck-heading_paragraph'
                },
                {
                    model: 'heading1',
                    view: 'h1',
                    title: 'Heading 1',
                    class: 'ck-heading_heading1'
                },
                {
                    model: 'heading2',
                    view: 'h2',
                    title: 'Heading 2',
                    class: 'ck-heading_heading2'
                },
                {
                    model: 'heading3',
                    view: 'h3',
                    title: 'Heading 3',
                    class: 'ck-heading_heading3'
                },
                {
                    model: 'heading4',
                    view: 'h4',
                    title: 'Heading 4',
                    class: 'ck-heading_heading4'
                },
                {
                    model: 'heading5',
                    view: 'h5',
                    title: 'Heading 5',
                    class: 'ck-heading_heading5'
                },
                {
                    model: 'heading6',
                    view: 'h6',
                    title: 'Heading 6',
                    class: 'ck-heading_heading6'
                }
            ]
        },
        image: {
            toolbar: [
                'toggleImageCaption',
                'imageTextAlternative',
                '|',
                'imageStyle:inline',
                'imageStyle:wrapText',
                'imageStyle:breakText',
                '|',
                'resizeImage'
            ]
        },
        initialData: initialData,
        language: 'ko',
        link: {
            addTargetToExternalLinks: true,
            defaultProtocol: 'https://',
            decorators: {
                toggleDownloadable: {
                    mode: 'manual',
                    label: 'Downloadable',
                    attributes: {
                        download: 'file'
                    }
                }
            }
        },
        translations: [translations],
        extraPlugins: [uploadPlugin]
    };

    return (
        <div>
            {isLayoutReady && <CKEditor editor={ClassicEditor} config={editorConfig} onChange={handleEditorChange} />}
        </div>
    );
}