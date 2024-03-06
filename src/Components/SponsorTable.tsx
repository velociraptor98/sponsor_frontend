import {
    Table,
    Header,
    HeaderRow,
    Body,
    Row,
    HeaderCell,
    Cell,
} from '@table-library/react-table-library/table';
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';

interface  SponsorTableProps{
    cols: string[];
    values: string[][];
}
const SponsorTable = (props: SponsorTableProps) => {
    const theme = useTheme(getTheme());
    const data ={nodes:  props.values};
    return(
        <Table data = {data} theme = {theme}>
            {(tableList: any) => (
                <Header>
                    <HeaderRow>
                        {props.cols.map(value => <HeaderCell>{value}</HeaderCell>)}
                    </HeaderRow>
                </Header>
            )}
        </Table>
    )
}
export default SponsorTable;