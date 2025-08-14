export default function Card({title, count, icon_name, onView,onAddOffer }){
    const statusClassMap = {
    "Applied": 'applied-card',
    "Refused": 'refused-card',
    "Pending": 'pending-card',
    "Offers": 'offer-card',
    "Interviews": 'interview-card',
    };
    let extraComponents = ""
    if (title == "Offers"){
        extraComponents = <button className="add-offer" onClick={onAddOffer}>+ Add Offer</button>
    }
    else if (title == "Interviews") {
        extraComponents = <a href="/jobs" className="view-interviews">See applications</a>
    }
    return (
        <div className={`card ${statusClassMap[title]}`}>
                    <img src={`/${icon_name}.svg`} className="card-icon" alt=""></img>
                    <h1 className="card-title">{title}</h1>
                    <div className="card-count">{count}</div>
                    
                    {extraComponents != null ? extraComponents : <a href="/">View details</a>}
        </div>
    );
}