import * as React from "react";
import { WebView } from "react-native-webview";

const PDFOpener = ({ route }) => {
  const uri = route.params.pdfUrl;
  return <WebView source={{ uri: uri }} style={{ flex: 1 }} />;
};
export default PDFOpener;
