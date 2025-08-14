export default function JobApplication({
  job_title,
  company_name,
  location,
  work_type,
  application_date,
  salary,
  application_tag,
  onView,
}) {
  return (
    <div className="application">
      <div className="job-title">{job_title}</div>
      <div className="company-name">{company_name}</div>
      <div className="location">{location}</div>
      <div className="work-type">{work_type}</div>
      <div className="application-date">{application_date}</div>
      <div className="salary">{salary}</div>
      <span className="view" onClick={onView}>
          View
      </span>
      <div className={`application-tag ${application_tag.toLowerCase()}`}>
        {application_tag}
      </div>
    </div>
  );
}