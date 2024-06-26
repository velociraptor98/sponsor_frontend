import React from "react";
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader, ModalOverlay,
    useDisclosure
} from "@chakra-ui/react";
import { useCSVReader } from 'react-papaparse';

interface  FileUploaderProps {
    setCol: (value: string[])=> {};
    setVal: (value: string[][])=>{};
}

const FileUploader = (props: FileUploaderProps) => {
    const { CSVReader } = useCSVReader();
    const OverlayBody = () => (
        <ModalOverlay
            bg='none'
            backdropFilter='auto'
            backdropInvert='80%'
            backdropBlur='2px'
        />
    )

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [overlay, setOverlay] = React.useState(<OverlayBody />)

    return (
        <>
            <Button
                colorScheme='teal'
                variant='ghost'
                size='lg'
                m='16'
                onClick={() => {
                    setOverlay(<OverlayBody />)
                    onOpen()
                }}
            >
                Upload
            </Button>
            <Modal isCentered isOpen={isOpen} onClose={onClose}>
                {overlay}
                <ModalContent>
                    <ModalHeader>Upload CSV file</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <CSVReader
                            onUploadAccepted={(results: any) => {
                                const value: string[][] = results.data;
                                const filtered = value.filter((_, i) => i !== 0);
                                props.setCol(value[0]);
                                props.setVal(filtered);
                                onClose();
                            }}
                            noDrag>
                            {({
                                  getRootProps,
                                  acceptedFile,
                              }: any) => (
                                <>
                                    <div {...getRootProps()}>
                                        {acceptedFile ? (
                                            <>
                                                <div></div>
                                            </>
                                        ) : (
                                            <Button>Upload</Button>
                                        )}
                                    </div>
                                </>
                            )}
                        </CSVReader>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
export default FileUploader;