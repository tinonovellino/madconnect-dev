import { useEffect } from "react";

declare global {
  interface Window {
    $?: (selector: string) => { load: (url: string) => void };
  }
}

export function NewsBar() {
  useEffect(() => {
    const $ = window.$;
    if ($) {
      $("#_include-news-bar").load("./-bar-include.html");
    }
  }, []);

  return <div id="_include-news-bar" />;
}

export default NewsBar;
