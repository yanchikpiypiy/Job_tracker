import styles from "../ApplicationPage/ApplicationList.module.css";
export function convertor(array) {
    const statusStyles = {
        "APPLIED": {
            square: styles.greenSq,
            pill: styles.pillBlue,
        },
        "PENDING": {
            square: styles.greySq,
            pill: styles.pillGrey,
        },
        "REFUSED": {
            square: styles.redSq,
            pill: styles.pillRed,
        },
        "INTERVIEW": {
            square: styles.greenSq,   // Or use a new color like styles.blueSq if defined
            pill: styles.pillGreen,   // Or define a new `pillBlue` for visual distinction
        },
    };
    
    const grouped = {};
    array.forEach(app => {
        const status = app.status?.toUpperCase() || "UNKNOWN";
        if (!grouped[status]) {
            grouped[status] = [];
        }

        grouped[status].push({
            id: app.id,
            company: app.company,
            position: app.position,
            location: app.location,
            type: app.job_type,
            date: app.date_applied.split('T')[0], // Format: "2025-07-14"
            salary: `$${app.salary.toLocaleString()}`, // Format: "$30,000"
        })
    })

    const result = []
    for (const status in grouped) {
        result.push({
            status,
            square: statusStyles[status]?.square || styles.greySq,
            pill: statusStyles[status]?.pill || styles.pillGrey,
            jobs: grouped[status]
        })
    }
    return result
}
