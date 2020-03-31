//tạo theme sử dụng chung cho cả App
import { createMuiTheme } from "@material-ui/core/styles";
//taọ theme xong rồi ra App để wrap bên ngoài tất cả các component
const theme = createMuiTheme({
  color: {
    primary: "#D32F2F", //mauchinh
    secondary: "00BCD4", //mauphu
    error: "#E64A19", //maukhiloi,
    textColor: "#FFFFFF",
    defaultTextColor: "#000000",
    hover: "rgba(0,0,0,0.08)"
  },
  typography: {
    fontFamily: "Roboto"
  },
  shape: {
    borderRadius: 4,
    backgroundColor: "#7B1F32",
    textColor: "#FFFFFF",
    borderColor: "#ccc"
  }
});

export default theme;
