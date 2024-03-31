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
import React, {useState, useEffect} from "react";


interface  SponsorTableProps{
    cols: string[];
    values: string[][];
}


const SponsorTable = (props: SponsorTableProps) => {
    const [currentSelection,setCurrentSelection] = useState("-");
    const [selectionList,setSelectionList] = useState(Array.of<string>);
    const [limitSelection,setLimitSelection] = useState(100);
    const [dataMapped,setDataMapped] = useState({nodes:[]});
    const chakraTheme = getTheme(DEFAULT_OPTIONS,{isVirtualized:true});
    const theme = useTheme(chakraTheme);


    const updateSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentSelection(event.target.value);
    }

    const updateLimitSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLimitSelection(Number(event.target.value));
    }
    const mapSelectionList = (dataMapped: any) => {
        let selectionSet:Set<string> = new Set();
        for(let data in dataMapped){
            selectionSet.add(dataMapped[data][1])
        }
        return Array.from(selectionSet.values());
    }

    useEffect(() => {
        setSelectionList(mapSelectionList(props.values));
    }, [props.values]);

    useEffect(() => {
        const mapDataToTableFormat = (values: String[][]):any => {
            let mainList: any[] = [];
            values.map((val:String[],index:number)  => {
                const tempVal = {
                    id: index,
                    org: val[0],
                    town: val[1],
                    county: val[2],
                    type: val[3],
                    route: val[4],

                };
                if(tempVal.town === currentSelection || currentSelection === '-'){
                    mainList.push(tempVal);
                }
                return mainList;
            });
            return {nodes: mainList};
        }
        setDataMapped(mapDataToTableFormat(props.values));
    }, [currentSelection,props.values]);


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

    return (
        <Box>
            <Select
                value={currentSelection}
                onChange={updateSelection}>
                <option value="-">-</option>
                {
                    selectionList.length && selectionList.map((val: string, index: number) => <option key={index} value={val}>{val}</option>)
                }
            </Select>
            <Select
                value={limitSelection}
                onChange={updateLimitSelection}>
                <option value="50">50</option>
                <option value="50">100</option>
                <option value="50">150</option>
                <option value="50">200</option>
            </Select>
            <Box p={3} borderWidth="1px" borderRadius="lg" height={"85vh"}>
        <Table
            data={dataMapped}
            theme={theme}
            pagination={pagination}
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
                            <Row key={index} item={item}>
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