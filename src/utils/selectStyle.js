export const selectStyle = {
    control: (base) => ({
      ...base,
      border: "1px solid var(--darkGrey)",
      padding: '0',
      boxShadow: "none",
      "&:focus": {
        border: "1px solid var(--primary)",
      },
      "&:hover": {
        border: "1px solid var(--primary)",
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "var(--primary)" : "var(--white)",
      color: state.isSelected ? "white" : "black",
      "&:hover": {
        backgroundColor: "var(--lavender)",
        color: "black",
      },
    }),
  }