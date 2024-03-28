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
import { usePagination } from '@table-library/react-table-library/pagination';
import {Button, Container, HStack, IconButton} from "@chakra-ui/react";
import { DEFAULT_OPTIONS, getTheme } from '@table-library/react-table-library/chakra-ui';
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa';


interface  SponsorTableProps{
    cols: string[];
    values: string[][];
}


const SponsorTable = (props: SponsorTableProps) => {
    const chakraTheme = getTheme(DEFAULT_OPTIONS);
    const theme = useTheme(chakraTheme);
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
            size: 100,
        },
    });

    const handlePageChange = (currentPage: number, totalPages: number, direction: string):number => {
        if(currentPage === totalPages && direction === 'UP'){
            return currentPage;
        }
        if(currentPage === 0 && direction === 'DOWN'){
            return currentPage;
        }
        if(direction === 'UP'){
            return currentPage + 1;
        }
        else{
            return currentPage - 1;
        }
    }

    return (
        <>
        <Table data={dataMapped} theme={theme} pagination={pagination}>
            {(tableList: any) => (
                <>
                    <Header>
                        <HeaderRow>
                            {props.cols.map(value => <HeaderCell>{value}</HeaderCell>)}
                        </HeaderRow>
                    </Header>
                    <Body>
                        {tableList.map((item: any, index: number) => (
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
    <div
        style={{display: 'flex', justifyContent: 'space-between'}}
    >
        <HStack justify="flex-end">
            <IconButton
                aria-label="previous page"
                icon={<FaChevronLeft />}
                colorScheme="teal"
                variant="ghost"
                disabled={pagination.state.page === 0}
                onClick={() => pagination.fns.onSetPage(handlePageChange(pagination.state.page,pagination.state.getTotalPages(dataMapped.nodes),'DOWN'))}
            />

            <IconButton
                aria-label="next page"
                icon={<FaChevronRight />}
                colorScheme="teal"
                variant="ghost"
                disabled={pagination.state.page + 1 === pagination.state.getTotalPages(dataMapped.nodes)}
                onClick = {() => pagination.fns.onSetPage(handlePageChange(pagination.state.page,pagination.state.getTotalPages(dataMapped.nodes),'UP'))}
            />
        </HStack>
    </div>
        </>
    )
}
export default SponsorTable;