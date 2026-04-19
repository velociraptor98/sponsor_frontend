import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Text,
  VStack,
  Icon,
} from "@chakra-ui/react";
import { useCSVReader } from "react-papaparse";
import { FaCloudUploadAlt } from "react-icons/fa";

interface FileUploaderProps {
  setCol: (value: string[]) => {};
  setVal: (value: string[][]) => {};
}

const FileUploader = (props: FileUploaderProps) => {
  const { CSVReader } = useCSVReader();
  const OverlayBody = () => (
    <ModalOverlay
      bg="blackAlpha.300"
      backdropFilter="blur(10px) hue-rotate(90deg)"
    />
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = React.useState(<OverlayBody />);

  return (
    <>
      <Button
        colorScheme="blue"
        variant="outline"
        size="lg"
        leftIcon={<Icon as={FaCloudUploadAlt} />}
        onClick={() => {
          setOverlay(<OverlayBody />);
          onOpen();
        }}
        px={8}
        shadow="md"
        _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
        transition="all 0.2s"
      >
        Upload Sponsor CSV
      </Button>
      <Modal isCentered isOpen={isOpen} onClose={onClose} size="sm">
        {overlay}
        <ModalContent borderRadius="xl">
          <ModalHeader textAlign="center" pt={8}>
            Upload CSV file
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <CSVReader
              onUploadAccepted={(results: any) => {
                const value: string[][] = results.data;
                const filtered = value.filter((_, i) => i !== 0);
                props.setCol(value[0]);
                props.setVal(filtered);
                onClose();
              }}
              noDrag
            >
              {({ getRootProps, acceptedFile }: any) => (
                <VStack
                  {...getRootProps()}
                  p={10}
                  border="2px dashed"
                  borderColor="gray.200"
                  borderRadius="lg"
                  _hover={{ borderColor: "blue.400", bg: "gray.50" }}
                  cursor="pointer"
                  spacing={4}
                >
                  <Icon as={FaCloudUploadAlt} w={12} h={12} color="blue.400" />
                  <Text fontWeight="medium" textAlign="center">
                    {acceptedFile
                      ? acceptedFile.name
                      : "Click to select a CSV file"}
                  </Text>
                  {!acceptedFile && (
                    <Text fontSize="xs" color="gray.500">
                      Only .csv files are supported
                    </Text>
                  )}
                </VStack>
              )}
            </CSVReader>
          </ModalBody>
          <ModalFooter bg="gray.50" borderBottomRadius="xl">
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default FileUploader;

