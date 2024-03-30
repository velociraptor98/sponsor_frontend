import {useState} from "react";
import {AbsoluteCenter, Card, Center} from "@chakra-ui/react";
import FileUploader from "./FileUploader";
import SponsorTable from "./SponsorTable";
const MainContainer = () =>{
    const [col, setCol] = useState<string[]>([]);
    const [val, setVal] = useState<string[][]>([]);
    const setColumn = (value: string[]) : any => {
        setCol(value)
    }
    const setValue = (value: string[][]): any => {
        setVal(value)
    }
    return(
        <Card height={"90vh"} alignItems={"center"}>
            {
                !val.length &&
                <AbsoluteCenter>
            <FileUploader
            setCol={setColumn}
            setVal={setValue}/>
                </AbsoluteCenter>
            }{
                !!val.length &&
            <SponsorTable
                cols={col}
                values={val}/>
        }
        </Card>

    )
}
export default MainContainer