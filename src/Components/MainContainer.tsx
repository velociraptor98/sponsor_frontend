import {useState} from "react";
import {Card} from "@chakra-ui/react";
import FileUploader from "./FileUploader";
const MainContainer = () =>{
    const [view,setView] = useState("upload")
    return(
        <Card
        className={"sm bg-white"}>
            <FileUploader/>
        </Card>
    )
}
export default MainContainer