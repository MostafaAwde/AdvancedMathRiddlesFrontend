import React, {
  useCallback,
  useState,
  useEffect,
  useMemo,
  useContext,
} from "react";
import ReactPaginate from "react-paginate";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Items } from "../items/Items";
import { useApiRequest } from "../../hooks/useApiRequest";
import urls from "../../services/apiUrls";
import "./paginatedItems.css";
import { DashboardContext } from "../../pages/dashboard/Dashboard";

export const PaginatedItems = () => {
  const { sendRequest, error } = useApiRequest();
  const { userLevel } = useContext(DashboardContext);
  const [loading, setLoading] = useState(false);
  const [riddles, setRiddles] = useState([]);
  const [totalRiddles, setTotalRiddles] = useState(0);

  const itemsPerPage = 8;
  const initialPage = Math.floor((userLevel - 1) / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    const fetchRiddles = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;
      console.log(userLevel);
      const response = await sendRequest(urls.riddles.get, {}, true, "get");
      if (response?.data) {
        const { riddles, totalRiddles } = response.data;
        const updatedRiddles = riddles.map((riddle) => ({
          ...riddle,
          image_url: riddle.image_url,
        }));
        setRiddles(updatedRiddles);
        setTotalRiddles(totalRiddles);
      }
    };
    fetchRiddles();
    setLoading(false);
  }, [userLevel, sendRequest]);

  const handlePageClick = useCallback(({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const { items, pageCount } = useMemo(() => {
    const items = Array.from({ length: totalRiddles }, (_, index) => {
      if (index < riddles.length && riddles[index].level <= userLevel) {
        return { isRiddle: true, riddle: riddles[index] };
      }
      return { isRiddle: false };
    }).reduce((acc, item, index) => {
      acc[`riddle${index + 1}`] = item;
      return acc;
    }, {});
    console.log(items);
    const pageCount = Math.ceil(totalRiddles / itemsPerPage);
    return { items, pageCount };
  }, [riddles, totalRiddles, userLevel]);

  const currentItems = useMemo(() => {
    const offset = currentPage * itemsPerPage;
    return Object.values(items).slice(offset, offset + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  if (loading) return <div className="loading-spinner"></div>;
  if (error) return <div className="error-message">Error loading data</div>;

  return (
    <div className="paginationContainer">
      <Items currentItems={currentItems} />

      <div className="paginationWrapper">
        <ReactPaginate
          breakLabel="..."
          nextLabel={<FaChevronRight className="rightArrow" />}
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          pageCount={pageCount}
          previousLabel={<FaChevronLeft className="leftArrow" />}
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          pageClassName="pagination-item"
          pageLinkClassName="pagination-link"
          activeClassName="active"
          activeLinkClassName="active-link"
          previousClassName="pagination-nav"
          nextClassName="pagination-nav"
          breakClassName="pagination-break"
          initialPage={currentPage}
          forcePage={currentPage}
        />

        <div className="page-status">
          Page {currentPage + 1} of {pageCount}
        </div>
      </div>
    </div>
  );
};
