import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
  },

  title: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
  },

  subtitle: {
    textAlign: "center",
    fontSize: 12,
    marginBottom: 20,
    fontWeight: "bold",
  },

  section: {
    marginBottom: 15,
  },

  label: {
    fontWeight: "bold",
  },
});

const ReportsPDF = ({ reports, startDate, endDate }) => {
  return (
    <Document>
      {reports.map((report) => (
        <Page key={report._id} size="A4" style={styles.page}>
          <Text>
            <Text style={styles.title}>Duty Reports</Text>
          </Text>
          <Text>
            <Text style={styles.subtitle}>
              {startDate} - {endDate}
            </Text>
          </Text>
          <Text style={styles.title}></Text>
          <View style={styles.section}>
            <Text>
              <Text style={styles.label}>Reporter:</Text>{" "}
              {report.reporter.fullname}
            </Text>

            <Text>
              <Text style={styles.label}>Work Station:</Text>{" "}
              {report.workStation}
            </Text>

            <Text>
              <Text style={styles.label}>Duty Type:</Text> {report.dutyType}
            </Text>

            <Text>
              <Text style={styles.label}>Date:</Text>{" "}
              {new Date(report.dutyDateTime).toLocaleDateString()}{" "}
              {report.dutyDateTime.split("T")[1]}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Work Done:</Text>

            <Text>{report.dutiesDone}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Challenges:</Text>

            <Text>{report.challenges}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Observations:</Text>

            <Text>{report.observations}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Interventions:</Text>

            <Text>{report.interventions}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Remarks:</Text>

            <Text>{report.remarks}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Comments:</Text>

            {report.comments?.map((comment) => (
              <Text key={comment._id}>
                {comment.commentBy?.surname} {comment.commentBy?.otherNames}:{" "}
                {comment.comment}
              </Text>
            ))}
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default ReportsPDF;
