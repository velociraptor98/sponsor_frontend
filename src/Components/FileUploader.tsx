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
  useColorModeValue,
  Text,
  VStack,
  Icon,
} from "@chakra-ui/react";
import { useCSVReader } from "react-papaparse";
import { FaCloudUploadAlt } from "react-icons/fa";

interface FileUploaderProps {
  setCol: (value: string[]) => void;
  setVal: (value: string[][]) => void;
  onError: (message: string) => void;
}

const FileUploader = (props: FileUploaderProps) => {
  const { CSVReader } = useCSVReader();
  const OverlayBody = () => (
    <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = React.useState(<OverlayBody />);

  const modalText      = useColorModeValue("#5c6a72", "#d3c6aa");
  const dropBorder     = useColorModeValue("#e0dcc9", "#475258");
  const iconColor      = useColorModeValue("#8da101", "#a7c080");
  const hoverBgColor   = useColorModeValue("#f4f0d9", "#3d484d");
  const hoverBorderCol = useColorModeValue("#8da101", "#a7c080");
  const mutedText      = useColorModeValue("#829181", "#9da9a0");

  return (
    <>
      <Button
        colorScheme="forest"
        variant="outline"
        size="lg"
        leftIcon={<Icon as={FaCloudUploadAlt} />}
        onClick={() => {
          setOverlay(<OverlayBody />);
          onOpen();
        }}
        w="full"
        shadow="md"
        _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
        transition="all 0.2s"
      >
        Upload Sponsor CSV
      </Button>

      <Modal isCentered isOpen={isOpen} onClose={onClose} size="sm">
        {overlay}
        <ModalContent layerStyle="glassStrong" borderRadius="xl" color={modalText}>
          <ModalHeader textAlign="center" pt={8}>
            Upload CSV file
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <CSVReader
              config={{ worker: true }}
              onUploadAccepted={(results: any) => {
                const [header, ...rows] = (results.data ?? []) as string[][];
                const body = rows.filter((row) =>
                  row.some((cell) => cell && cell.trim() !== ""),
                );
                // The table renders five fixed columns, so anything narrower
                // than that can't be a sponsor list.
                if (!header || header.length < 5 || body.length === 0) {
                  onClose();
                  props.onError(
                    "That file doesn't look like a sponsor list. It needs a header row, at least one data row, and five columns (organisation, town, county, type and route).",
                  );
                  return;
                }
                props.setCol(header);
                props.setVal(body);
                onClose();
              }}
              noDrag
            >
              {({ getRootProps, acceptedFile }: any) => (
                <VStack
                  {...getRootProps()}
                  p={10}
                  border="2px dashed"
                  borderColor={dropBorder}
                  borderRadius="lg"
                  _hover={{ borderColor: hoverBorderCol, bg: hoverBgColor }}
                  cursor="pointer"
                  spacing={4}
                >
                  <Icon as={FaCloudUploadAlt} w={12} h={12} color={iconColor} />
                  <Text fontWeight="medium" textAlign="center">
                    {acceptedFile ? acceptedFile.name : "Click to select a CSV file"}
                  </Text>
                  {!acceptedFile && (
                    <Text fontSize="xs" color={mutedText}>
                      Only .csv files are supported
                    </Text>
                  )}
                </VStack>
              )}
            </CSVReader>
          </ModalBody>
          <ModalFooter borderBottomRadius="xl">
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
