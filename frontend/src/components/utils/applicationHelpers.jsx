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
            square: styles.greenSq,
            pill: styles.pillGreen,
        },
    };

    const grouped = {};
    array.forEach(app => {
        const status = app.status?.toUpperCase() || "UNKNOWN";
        if (!grouped[status]) {
            grouped[status] = [];
        }

        // Safe date formatting
        let formattedDate = "N/A";
        if (app.date_applied) {
            try {
                formattedDate = app.date_applied.split('T')[0];
            } catch (e) {
                formattedDate = "N/A";
            }
        }

        // Safe salary formatting
        let formattedSalary = "N/A";
        if (app.salary !== null && app.salary !== undefined) {
            formattedSalary = `$${app.salary.toLocaleString()}`;
        }

        grouped[status].push({
            id: app.id,
            company: app.company || "N/A",
            position: app.position || "N/A",
            location: app.location || "N/A",
            type: app.job_type || "N/A",
            date: formattedDate,
            salary: formattedSalary,
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
