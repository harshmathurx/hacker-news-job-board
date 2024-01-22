
import { useEffect, useState } from "react"

const API_ENDPOINT = 'https://hacker-news.firebaseio.com/v0'
const ITEMS_PER_PAGE = 6

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [jobs, setJobs] = useState([])
  const [jobIds, setJobIds] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)

  const fetchItems = async (pageNo) => {
    setCurrentPage(pageNo)
    setIsLoading(true)

    let itemsList = jobIds;
    if (itemsList === null) {
      console.log('fetching')
      const res = await fetch(`${API_ENDPOINT}/jobstories.json`)
      itemsList = await res.json()
      setJobIds(itemsList)
    }
    console.log(itemsList)

    let jobIdsForPage = itemsList.slice(currentPage * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE)

    const jobsPosts = await Promise.all(
      jobIdsForPage.map(async itemId => {
        console.log(`fetching: ${API_ENDPOINT}/item/${itemId}.json`)
        return fetch(`${API_ENDPOINT}/item/${itemId}.json`).then(res => res.json())
      })
    )

    setJobs([...jobs, ...jobsPosts])
    setIsLoading(false)
  }

  useEffect(() => {
    if (currentPage === 0) fetchItems(currentPage)
  }, [])

  const JobPosting = ({ url, title, by, time }) => {

    const formattedTime = new Date(time * 1000).toLocaleString()
    return <div className="jobPost" role="listItem">
      <h3 className="jobPostTitle">
        <a
          href={url}
          className={url ? "" : "inactiveLink"}
          target="_blank"
          rel="noopener"
        >
          {title}
        </a>
      </h3>
      <div>
        <span className="jobPostMetadata">By {by} {formattedTime}</span>
      </div>
    </div>
  }

  return <div>
    <h1 className="heroTitle">Hacker News Jobs Board</h1>

    <div className="jobList" role="list">
      {jobs.map((job, index) => (
        <JobPosting key={index} title={job.title} url={job.url}
          time={job.time} by={job.by}
        />
      ))}
    </div>
    {(!jobIds || isLoading) && <div className="loading">loading....</div>}
    <button className="loadMoreBtn" disabled={isLoading} onClick={() => fetchItems(currentPage + 1)}>{isLoading ? "Loading" : "Load More Jobs"}</button>
  </div>;
}
