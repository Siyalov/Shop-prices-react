import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import "./style.css";

export default function Pagination({
  page,
  setPage,
  totalPages,
}: {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="pagination-block">
      <ButtonGroup>
        <Button onClick={() => setPage(Math.max(page - 1, 0))}>{t('previousPage')}</Button>
        {page >= 1 ? <Button onClick={() => setPage(0)}>1</Button> : ''}
        {page >= 2 ? <Button onClick={() => setPage(1)}>2</Button> : ''}
        {page >= 3 ? <Button onClick={() => setPage(2)}>3</Button> : ''}
        {page >= 4 ? <Button disabled>...</Button> : ''}
        <Button disabled>{(page + 1) || '1'}</Button>
        {page <= totalPages - 4 ? <Button disabled>...</Button> : ''}
        {page <= totalPages - 3 ? <Button onClick={() => setPage(totalPages - 2)}>{totalPages - 1}</Button> : ''}
        {page <= totalPages - 2 ? <Button onClick={() => setPage(totalPages - 1)}>{totalPages}</Button> : ''}
        {page <= totalPages - 1 ? <Button onClick={() => setPage(totalPages)}>{totalPages + 1}</Button> : ''}
        <Button onClick={() => setPage(Math.min(page + 1, totalPages))}>{t('nextPage')}</Button>
      </ButtonGroup>
    </div>
  )
}
