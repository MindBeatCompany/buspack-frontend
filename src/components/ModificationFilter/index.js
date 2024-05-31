import React, { useState, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { SearchInput } from "../index";
import CustomCheckbox from "../CustomCheckbox/CustomCheckbox";
import ActionButton from "../ActionButton";

const ModificationFilter = ({
  tableType,
  t,
  itemsToFilter,
  toDeactivate,
  handleFilter,
}) => {
  const [initialItems, setInitialItems] = useState([]);

  useEffect(() => {
    setInitialItems(itemsToFilter);
  }, []);

  const [columnsToSearch, setColumnsToSearch] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState("");

  const onChangeCheckbox = (e) => {
    const check = e.target.checked;
    const filterCriterion = e.target.value;

    if (check) {
      setColumnsToSearch([...columnsToSearch, filterCriterion]);
    } else {
      var newArr = columnsToSearch.filter(
        (criterion) => criterion !== filterCriterion
      );
      setColumnsToSearch(newArr);
    }
  };
  const onChangeSearchInput = (e) => {
    const value = e.target.value;
    setSearchInputValue(value);
  };

  const search = () => {
    if (columnsToSearch.length === 0) {
      handleFilter(initialItems);
      return;
    }
    var arrFiltered = [];

    const filterFunctions = {
      id: (listItems) => {
        let test = [];
        listItems.map((item) => {
          if (
            item.codeECO.toLowerCase().includes(searchInputValue.toLowerCase())
          ) {
            test.push(item);
          }
        });
        return test;
      },
      companyName: (listItems) => {
        let test = [];
        listItems.map((item) => {
          if (
            item.companyName
              .toLowerCase()
              .includes(searchInputValue.toLowerCase())
          ) {
            test.push(item);
          }
        });
        return test;
      },
      role: (listItems) => {
        let test = [];
        listItems.map((item) => {
          if (
            item.role.name
              .toLowerCase()
              .includes(searchInputValue.toLowerCase())
          ) {
            test.push(item);
          }
        });
        return test;
      },
      email: (listItems) => {
        let test = [];
        listItems.map((item) => {
          if (
            item.email.toLowerCase().includes(searchInputValue.toLowerCase())
          ) {
            test.push(item);
          }
        });
        return test;
      },
      userName: (listItems) => {
        let test = [];
        listItems.map((item) => {
          if (
            item.userName.toLowerCase().includes(searchInputValue.toLowerCase())
          ) {
            test.push(item);
          }
        });
        return test;
      },
      // accountType: (listItems) => {
      //   let test = [];
      //   listItems.map((item) => {
      //     if (
      //       item.accountType
      //         .toLowerCase()
      //         .includes(searchInputValue.toLowerCase())
      //     ) {
      //       test.push(item);
      //     }
      //   });
      //   return test;
      // },
    };

    columnsToSearch.forEach((columnName) => {
      if (columnName === "isActive") return;

      let items = filterFunctions[columnName](initialItems);
      if (items) arrFiltered.push(...items);
      arrFiltered = [...new Set(arrFiltered)];
    });

    //it means "inactivate" filter is active
    // if (columnsToSearch.includes("isActive")) {
    //   const itemsToFilter = arrFiltered.length > 0 ? arrFiltered : initialItems;
    //   console.log(itemsToFilter);

    //   arrFiltered = itemsToFilter.filter((item) =>
    //     toDeactivate.includes(item.id.toString())
    //   );
    // }
    // console.log(arrFiltered);
    handleFilter(arrFiltered);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    search();
  };

  // we must match labels with values 'cause they are different and we need to have equal values to compare to the criterions and accounts' properties
  const checkValues = {
    id: "id",
    company: "companyName",
    type: "accountType",
    //deactivate: "isActive",
    email: "email",
    userName: "userName",
    role: "role",
  };

  const formLabels = {
    users: ["userName", "email", "role"],
    accounts: ["id", "company", "type"],
  };

  return (
    <>
      <h3 className="mb-3"> {t("filters")} </h3>
      <Form onSubmit={onSubmit}>
        <Row>
          <Col className="p-0" xs={12} lg={6}>
            <Row>
              {formLabels[tableType].map((label, idx) => (
                <Col className="pl-0" key={idx} xs={12} md={4} lg={4}>
                  <div>
                    <CustomCheckbox
                      name={label}
                      onChange={onChangeCheckbox}
                      value={checkValues[label]}
                      id={`${label}-id`}
                    />
                    <label htmlFor={`${label}-id`} className="ml-2">
                      {t(`formLabels.${label}`)}{" "}
                    </label>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
          <Col xs={8} lg={6} className="text-left text-lg-right p-0">
            <SearchInput
              onChange={onChangeSearchInput}
              value={searchInputValue}
              name="searchInputValue"
            />
            <Row className="justify-content-end">
              <Col xs={12} md={4} className=" p-0">
                <ActionButton type="submit" width="100">
                  {t("search")}
                </ActionButton>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default ModificationFilter;
