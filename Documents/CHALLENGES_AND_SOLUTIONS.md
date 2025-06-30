Technical Challenges and Solutions

Challenge 1: Deprecated or Unsupported APIs
The initially recommended APIs, specifically Yahoo Finance API and Google Finance API, are deprecated or no longer actively maintained. This posed a significant obstacle in retrieving reliable and up-to-date financial data.
Solution:
To address this, I leveraged an unofficial Yahoo Finance library that remains functional and maintained by the community. However, since there is no unofficial library available for Google Finance, I adopted a web scraping approach using tools like Axios for HTTP requests and Cheerio for parsing HTML content. This method enabled me to extract essential financial metrics directly from the Google Finance web pages, ensuring the application could provide real-time and accurate data despite the lack of official API support.

Challenge 2: Absence of Official APIs for Google Finance Data
The Yahoo Finance API was unofficial and partially maintained, but Google Finance does not provide any official or unofficial API for accessing financial metrics. This presented a significant challenge in retrieving accurate and timely fundamental data like P/E ratio and earnings per share.
Solution:
To overcome this limitation, I implemented web scraping techniques using the Cheerio library paired with Axios for HTTP requests. By carefully inspecting the Google Finance webpage structure, I extracted the required financial metrics directly from the HTML elements. This approach ensured access to up-to-date financial data without relying on deprecated or unavailable APIs.
Additionally, I built a resilient scraper that handles structural changes and network errors gracefully, incorporating fallback values and comprehensive error logging to maintain system stability.

Challenge 3: Inefficient Sequential API Requests Causing Latency
In the initial implementation, data fetching for multiple portfolio items was done sequentially—waiting for each API response before starting the next. This approach significantly increased the total time required to update the portfolio data, resulting in slow performance and a suboptimal user experience.
Solution:
To address this inefficiency, I implemented parallel API calls using Promise.all. This allowed simultaneous execution of multiple asynchronous requests to external services (Yahoo Finance and Google Finance), thereby drastically reducing the overall data retrieval time.
By dispatching API calls concurrently, the system efficiently utilized network and CPU resources, improved scalability for larger data sets, and ensured that users received timely, up-to-date information with minimal delay.

Challenge 4:
Performance issues due to re-creation of column definitions on every render
In React, defining table column configurations directly inside the component causes the columns array to be recreated on every render. This leads to unnecessary re-renders and recalculations in the table library (@tanstack/react-table), degrading performance and slower UI updates.
Solution:
Memoizing column definitions using React.useMemo
To avoid these performance pitfalls, column definitions are wrapped in a React.useMemo hook. This ensures the column array is only created once and only recomputed when its dependencies change. By providing a stable reference for columns, the table can optimize rendering and calculations, resulting in smoother performance.

Challenge 5:
Data Inaccuracy Due to Unofficial APIs and Web Scraping
The application relies on unofficial APIs and web scraping techniques to fetch real-time financial data, as official APIs are deprecated or unavailable. These methods may sometimes result in inaccurate or delayed data due to changes in source websites, rate limits, or scraping failures.
Solution:
Implementing a User Disclaimer for Data Accuracy
To maintain transparency and manage user expectations, a clear disclaimer is presented in the UI whenever data is loaded. This disclaimer informs users that data may occasionally be inaccurate or delayed due to the nature of the data sources. Users have the option to acknowledge and close the disclaimer, after which they can proceed to view the portfolio data.
This approach ensures users are aware of the limitations without compromising the app’s usability. 

Challenge 6:
Handling Frequently Changing Dynamic Data
Financial data is highly dynamic and can change frequently within short intervals. Users relying on static snapshots risk missing critical updates or changes to their portfolio. Without timely updates, the displayed data may become outdated quickly, impacting user decisions.
Solution:
Automated Periodic Data Refresh
To ensure users always view the most current data, the application implements an automatic data refresh mechanism that fetches updated portfolio information every 15 seconds. This continuous polling keeps the interface synchronized with the latest available data, minimizing manual refreshes and enhancing user experience with near real-time updates.



