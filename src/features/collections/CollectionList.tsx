import { Box, Heading} from '@chakra-ui/react';
import { map } from 'lodash';
import { Link } from 'react-router-dom';
import { CollectionMeta } from '@polybase/client';
import { usePolybase, useCollection } from '@polybase/react';
import { Loading } from 'modules/loading/Loading';
import Pagination from 'features/common/Pagination';
import { PaginationProps } from 'features/common/Pagination';
import { useState } from 'react';


/** @jsx CollectionList */


export interface CollectionListProps {
  pk?: string | null,
}

export function CollectionList({ pk }: CollectionListProps) {
  const polybase = usePolybase();

  const [page, setPage] = useState(1);

  const query = polybase
    .collection('Collection');

  const { data, loading, error } = useCollection<CollectionMeta>(
    pk
      ? query.where('publicKey', '==', pk)
      : query.sort('lastRecordUpdated', 'desc'),
  );

  const items = map(data?.data, (item) => {
    return (
      <Link to={`/collections/${encodeURIComponent(item.data.id)}`} key={item.data.id}>
        <Box bg='bw.50' borderRadius='md' p={4}>
          <Heading size='md'>{item.data.id}</Heading>
        </Box>
      </Link>
    );
  });

  const pageProps: PaginationProps = {
    page: page || 1,
    setPage: setPage,
    pageLength: 100,
    items: items,
  };

  return (
    <Loading loading={loading}>
      {error && <Box color='error'>{error.message}</Box>}
      <Pagination {...pageProps} ></Pagination>
    </Loading>
  );
}