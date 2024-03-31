import {Box, Container, useColorModeValue} from '@chakra-ui/react'

const Footer = () => {
    return (
        <Box as="footer" bg={useColorModeValue('gray.100', 'gray.900')} px={4} role="contentinfo">
            <Container>
                <Box role="presentation" py="3" px="4" color="fg.accent.default">
                    <p className="love">Made with <i className="icon ion-heart"></i> in Chicago</p>
                </Box>
            </Container>
        </Box>
    )
}
export default Footer;