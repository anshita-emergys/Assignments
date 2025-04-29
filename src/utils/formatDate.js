import dayjs from "dayjs";

const formatDate = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return "Invalid Date";
  const dateOnly = dateStr.split("T")[0];
  const combined = `${dateOnly}T${timeStr}`;
  return dayjs(combined).format("DD MMM YYYY - HH:mm");
};
export default formatDate
