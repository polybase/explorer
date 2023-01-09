import { Button, Stack, Box, HStack, Container} from "@chakra-ui/react";

export interface PaginationProps {
    page: number,
    setPage: any,
    pageLength: number,
    items: any,
}

export default function Pagination({ page, setPage, pageLength, items }: PaginationProps) {

    if(page*pageLength - items.length > pageLength) {
        setPage(page-1)
    }
    const pageItems =  items.slice(pageLength * (page - 1), pageLength * page)
    
    return (
            
            <Container maxW='container.md' p={4} alignSelf={'center'} >
                <Stack spacing={4}>
                    {pageItems}
                </Stack>
                <Container maxW='container.md' p={4}  >
                    <HStack width={'max'} spacing={4} justify={'center'}>
                    <Button onClick={()=>setPage(page - 1)} > {"<"} </Button>
                    <Box>{page}</Box>
                    <Button onClick={() => setPage(page + 1)}> {">"} </Button>
                    </HStack>
                </Container>
            </Container>   
    );
    }