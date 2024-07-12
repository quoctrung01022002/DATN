import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faClipboardList,
  faBoxes,
  faUsers,
  faTruck,
  faWarehouse,
} from "@fortawesome/free-solid-svg-icons";
import "../../../css/Revenue.css";

const RevenueChart = () => {
  const today = new Date();
  const defaultMonth = today.getMonth() + 1;
  const defaultYear = today.getFullYear();

  const [inventoryMovementsCount, setInventoryMovementsCount] = useState("");
  const [month, setMonth] = useState(defaultMonth.toString());
  const [year, setYear] = useState(defaultYear.toString());

  const [pieChartData, setPieChartData] = useState({});
  const [lineChartData, setLineChartData] = useState([]);
  const [columnChartData, setColumnChartData] = useState({});
  const [pieChartInstance, setPieChartInstance] = useState(null);
  const [lineChartInstance, setLineChartInstance] = useState(null);
  const [columnChartInstance, setColumnChartInstance] = useState(null);
  const [revenue, setRevenue] = useState("");
  const [orderCount, setOrderCount] = useState("");
  const [productCount, setProductCount] = useState("");
  const [userCount, setUserCount] = useState("");
  const [inventoryMovements1Count, setInventoryMovements1Count] = useState("");

  const fetchData = async () => {
    try {
      const inventoryMovementsResponse = await axios.get(
        `https://localhost:7138/api/Revenue/CountInventoryMovements?month=${month}&year=${year}`
      );
      setInventoryMovementsCount(inventoryMovementsResponse.data);

      const pieChartResponse = await axios.get(
        `https://localhost:7138/api/Revenue/CountSoldProductsByType?month=${month}&year=${year}`
      );
      setPieChartData(pieChartResponse.data);

      const lineChartResponse = await axios.get(
        `https://localhost:7138/api/Revenue/RevenueDate?month=${month}&year=${year}`
      );
      setLineChartData(lineChartResponse.data);

      const columnChartResponse = await axios.get(
        `https://localhost:7138/api/Revenue/TotalRevenueByMonth?year=${year}`
      );
      setColumnChartData(columnChartResponse.data);

      const revenueResponse = await axios.get(
        `https://localhost:7138/api/Revenue?month=${month}&year=${year}`
      );
      setRevenue(revenueResponse.data);

      const orderCountResponse = await axios.get(
        `https://localhost:7138/api/Revenue/CountOrders?month=${month}&year=${year}`
      );
      setOrderCount(orderCountResponse.data);

      const productCountResponse = await axios.get(
        `https://localhost:7138/api/Revenue/CountDistinctProductIds?month=${month}&year=${year}`
      );
      setProductCount(productCountResponse.data);

      const userCountResponse = await axios.get(
        `https://localhost:7138/api/Revenue/CountDistinctUserIds?month=${month}&year=${year}`
      );
      setUserCount(userCountResponse.data);

      const inventoryMovements1Response = await axios.get(
        `https://localhost:7138/api/Revenue/CountInventoryMovements1?month=${month}&year=${year}`
      );
      setInventoryMovements1Count(inventoryMovements1Response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData();
  };

  useEffect(() => {
    fetchData();  // Fetch data on component mount with default month and year
  }, []);

  useEffect(() => {
    renderPieChart();
    renderLineChart();
    renderColumnChart();
  }, [pieChartData, lineChartData, columnChartData]);

  const destroyPieChart = () => {
    if (pieChartInstance) {
      pieChartInstance.destroy();
    }
  };

  const destroyLineChart = () => {
    if (lineChartInstance) {
      lineChartInstance.destroy();
    }
  };

  const destroyColumnChart = () => {
    if (columnChartInstance) {
      columnChartInstance.destroy();
    }
  };

  const renderPieChart = () => {
    destroyPieChart();
    if (pieChartData && Object.keys(pieChartData).length > 0) {
      const ctx = document.getElementById("pie-chart");
      const newPieChartInstance = new Chart(ctx, {
        type: "pie",
        data: {
          labels: Object.keys(pieChartData),
          datasets: [
            {
              data: Object.values(pieChartData),
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#66FF99",
                "#9966FF",
                "#FF9933",
              ],
              hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#66FF99",
                "#9966FF",
                "#FF9933",
              ],
            },
          ],
        },
      });
      setPieChartInstance(newPieChartInstance);
    }
  };

  const renderLineChart = () => {
    destroyLineChart();
    if (lineChartData && lineChartData.length > 0) {
      const ctx = document.getElementById("line-chart");
      const labels = lineChartData.map((item) => item.key);
      const values = lineChartData.map((item) => item.value);

      const newLineChartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Doanh thu",
              data: values,
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        },
      });
      setLineChartInstance(newLineChartInstance);
    }
  };

  const renderColumnChart = () => {
    destroyColumnChart();
    if (columnChartData && Object.keys(columnChartData).length > 0) {
      const ctx = document.getElementById("column-chart");
      const newColumnChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: Object.keys(columnChartData),
          datasets: [
            {
              label: "Doanh thu theo tháng",
              data: Object.values(columnChartData),
              backgroundColor: "#FF5733",
              borderColor: "#FF5733",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
      setColumnChartInstance(newColumnChartInstance);
    }
  };

  return (
    <div className="container">
      <h2 style={{ display: "block" }}>Thống kê doanh số</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group mb-3" style={{ display: "flex", alignItems: "center", marginTop: "60px" }}>
          <label htmlFor="month" style={{ marginRight: "5px" }}>
            Chọn tháng:
          </label>
          <select
            id="month"
            className="form-select custom-select"
            value={month}
            onChange={handleMonthChange}
            style={{ width: "100px", marginRight: "15px" }}
          >
            <option value="">Chọn tháng...</option>
            {[...Array(12).keys()].map((month) => (
              <option key={month + 1} value={month + 1}>
                Tháng {month + 1}
              </option>
            ))}
          </select>
          <label htmlFor="year" style={{ marginRight: "5px" }}>
            Chọn năm:
          </label>
          <select
            id="year"
            className="form-select custom-select"
            value={year}
            onChange={handleYearChange}
            style={{ width: "100px", marginRight: "15px" }}
          >
            <option value="">Chọn năm...</option>
            {[...Array(new Date().getFullYear() - 1999).keys()].map((year) => (
              <option key={2000 + year} value={2000 + year}>
                Năm {2000 + year}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="btn btn-primary btn-submit"
            style={{ marginLeft: "5px" }}
          >
            Gửi
          </button>
        </div>
      </form>
      <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
        <div className="p-container" style={{ backgroundColor: "#FF5733" }}>
          <FontAwesomeIcon icon={faDollarSign} />
          <p>Doanh thu: {revenue}</p>
        </div>
        <div className="p-container" style={{ backgroundColor: "#33FF57" }}>
          <FontAwesomeIcon icon={faClipboardList} />
          <p>Số đơn hàng khi khách đã nhận hàng: {orderCount}</p>
        </div>
        <div className="p-container" style={{ backgroundColor: "#5733FF" }}>
          <FontAwesomeIcon icon={faBoxes} />
          <p>Số lượng sản phẩm khác nhau đã bán: {productCount}</p>
        </div>
        <div className="p-container" style={{ backgroundColor: "#33FFFF" }}>
          <FontAwesomeIcon icon={faUsers} />
          <p>Số lượng người dùng khác nhau: {userCount}</p>
        </div>
        <div className="p-container" style={{ backgroundColor: "#FF33FF" }}>
          <FontAwesomeIcon icon={faTruck} />
          <p>Số lượng nhập kho: {inventoryMovementsCount}</p>
        </div>
        <div className="p-container" style={{ backgroundColor: "#FFFF33" }}>
          <FontAwesomeIcon icon={faWarehouse} />
          <p>Số lượng xuất kho: {inventoryMovements1Count}</p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <label htmlFor="pie-chart" style={{ marginBottom: "10px" }}>
            Báo cáo loại sản phẩm bán được trong tháng {month} năm {year}
          </label>
          <canvas id="pie-chart"></canvas>
        </div>
        <div className="col-md-4">
          <label htmlFor="line-chart" style={{ marginBottom: "10px" }}>
            Báo cáo doanh thu tháng {month} năm {year}
          </label>
          <canvas id="line-chart"></canvas>
        </div>
        <div className="col-md-4">
          <label htmlFor="column-chart" style={{ marginBottom: "10px" }}>
            Báo cáo doanh thu các tháng, năm {year}
          </label>
          <canvas id="column-chart"></canvas>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
