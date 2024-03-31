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
import {Box, HStack, IconButton, Select} from "@chakra-ui/react";
import { DEFAULT_OPTIONS, getTheme } from '@table-library/react-table-library/chakra-ui';
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa';
import {useState} from "react";


interface  SponsorTableProps{
    cols: string[];
    values: string[][];
}


const SponsorTable = (props: SponsorTableProps) => {
    const [selectionList,setSelectionList] = useState(Array.of<String>);
    const [limitSelection,setLimitSelection] = useState(100);
    const chakraTheme = getTheme(DEFAULT_OPTIONS,{isVirtualized:true});
    const theme = useTheme(chakraTheme);
    const mapDataToTableFormat = (values: String[][]):any => {
        let mainList: any[] = [];
        values.map((val:String[],index:number)=>{
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

    const mapSelectionList = (dataMapped: any) => {
        let selectionSet:Set<String> = new Set();
        for(let data in dataMapped){
            selectionSet.add(dataMapped[data][1])
        }
        const selectionList: String[] = Array.from(selectionSet.values());
        setSelectionList(selectionList);
    }

    const dataMapped = mapDataToTableFormat(props.values);
    const selectionListEntries = mapSelectionList(props.values);


    const pagination = usePagination(dataMapped, {
        state: {
            page: 0,
            size: limitSelection,
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

    const VIRTUALIZED_OPTIONS = {
        rowHeight: (_item: any, _index: any) => 25,
    };

    return (
        <Box>
            <Select></Select>
        <Box p={3} borderWidth="1px" borderRadius="lg" height={"85vh"}>
        <Table
            data={dataMapped}
            theme={theme}
            pagination={pagination}
            virtualizedOptions={VIRTUALIZED_OPTIONS}
            layout={{ isDiv: true, fixedHeader: true }}
        >
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
        </Box>
        </Box>
    )
}
export default SponsorTable;