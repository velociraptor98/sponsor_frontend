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
import { usePagination } from '@table-library/react-table-library/pagination';


interface  SponsorTableProps{
    cols: string[];
    values: string[][];
}


const SponsorTable = (props: SponsorTableProps) => {
    const theme = useTheme(getTheme());
    const mapDataToTableFormat = (values: String[][]):any => {
        let mainList: any[] = [];
        const test = values.map((val:String[],index:number)=>{
            const tempVal = {
                id: index,
                org: val[0],
                town: val[1],
                county: val[2],
                type: val[3],
                route: val[4],

            };
            mainList.push(tempVal);
        });
        return {nodes: mainList};
    }

    const dataMapped = mapDataToTableFormat(props.values);

    const pagination = usePagination(dataMapped, {
        state: {
            page: 0,
            size: 50,
        },
    });
    return(
        <Table data = {dataMapped} theme = {theme} pagination = {pagination}>
            {(tableList: any) => (
                <>
                <Header>
                    <HeaderRow>
                        {props.cols.map(value => <HeaderCell>{value}</HeaderCell>)}
                    </HeaderRow>
                </Header>
                <Body>
                    {tableList.map((item : any, index: any) => (
                        <Row key={item.id} item={item}>
                        <Cell>{item.org}</Cell>
                        <Cell>{item.town}</Cell>
                        <Cell>{item.county}</Cell>
                        <Cell>{item.type}</Cell>
                        <Cell>{item.route}</Cell>
                        </Row>
                    ))}
                </Body>
                </>
            )}
        </Table>
    )
}
export default SponsorTable;