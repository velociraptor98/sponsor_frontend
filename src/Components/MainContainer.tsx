import {useState} from "react";
import {Card} from "@chakra-ui/react";
import FileUploader from "./FileUploader";
const MainContainer = () =>{
    const [view,setView] = useState("upload")
    const [col, setCol] = useState<string[]>([]);
    const [val, setVal] = useState<string[][]>([]);
    const setColumn = (value: string[]) : any => {
        setCol(value)
    }
    const setValue = (value: string[][]): any => {
        setVal(value)
    }
    return(
        <Card
        className={"sm bg-white"}>
            {
                !val.length &&
            <FileUploader
            setCol={setColumn}
            setVal={setValue}/>
            }
        </Card>
    )
}
export default MainContainer