import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_CONTACT_LIST } from "src/graphql/Query/getData";
import { GetContactList } from "src/graphql/variables/GetContactList";
export const useContactData = (limit: number) => {
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [contactData, setContactData] = useState<Array<any>>([]);
  const [loadingMore, setLoadingMore] = useState(false);

  const {
    data: allData,
    loading: loadingAllData,
    refetch: refetchAllData,
  } = useQuery(GET_CONTACT_LIST, {
    variables: GetContactList("", limit, offset, "asc"),
  });

  const loadMoreData = () => {
    if (loadingAllData) {
      return;
    }
    if (allData?.contact.length === 0) {
      return;
    }
    setLoadingMore(true);
    setTimeout(() => {
      if (hasMore) {
        setOffset(offset + limit);
      }
      setLoadingMore(false);
    }, 1000);
  };

  useEffect(() => {
    if (allData) {
      const newContactList = allData.contact || [];
      if (newContactList.length < limit) {
        setHasMore(false);
      }
      setContactData((prevData) => [...prevData, ...newContactList]);
    }
  }, [allData, limit]);

  useEffect(() => {
    window.addEventListener("scroll", loadMoreData);
    return () => {
      window.removeEventListener("scroll", loadMoreData);
    };
  }, [loadMoreData]);

  return { contactData, loadingMore, refetchAllData };
};
