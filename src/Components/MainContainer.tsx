import {Fragment, useState} from "react";
import {AbsoluteCenter, Card} from "@chakra-ui/react";
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
        // <Container minW={"100vh"}>
        <Fragment>
            {
                !val.length &&
                <Card height={"85vh"} alignItems={"center"}>
                <AbsoluteCenter>
            <FileUploader
            setCol={setColumn}
            setVal={setValue}/>
                </AbsoluteCenter>
                </Card>
            }
            {
                !!val.length &&
            <SponsorTable
                cols={col}
                values={val}/>
        }

        {/*</Container>*/}
</Fragment>

    )
}
export default MainContainer