import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { PlanResult, Priority } from "@/lib/types";
import { EVENT_TYPE_LABELS } from "@/lib/types";

const INDIGO = "#4f46e5";
const INDIGO_DARK = "#3730a3";
const SLATE_900 = "#0f172a";
const SLATE_500 = "#64748b";
const SLATE_200 = "#e2e8f0";
const ROSE = "#e11d48";
const AMBER = "#b45309";

const PRIORITY_COLORS: Record<Priority, string> = { critical: ROSE, important: AMBER, optional: SLATE_500 };

// react-pdf's built-in Helvetica font has no glyph for ₹ (U+20B9) — it renders as a broken
// character. The web UI can use ₹ freely (browser fonts cover it); the PDF uses "Rs." instead.
const formatInr = (n: number) => `Rs. ${Math.round(n).toLocaleString("en-IN")}`;

const sanitizeForPdf = (text: string) => text.replace(/₹/g, "Rs. ");

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const styles = StyleSheet.create({
  page: { fontSize: 9.5, color: SLATE_900, fontFamily: "Helvetica" },
  content: { paddingHorizontal: 32, paddingBottom: 48 },

  header: { backgroundColor: INDIGO, paddingHorizontal: 32, paddingVertical: 22, marginBottom: 20 },
  brandRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  brandMark: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#ffffff" },
  brandTag: { fontSize: 8, color: "#c7d2fe" },
  eventTitle: { fontSize: 20, fontFamily: "Helvetica-Bold", color: "#ffffff" },
  eventMeta: { fontSize: 9, color: "#e0e7ff", marginTop: 4 },

  narrative: {
    fontSize: 9.5,
    lineHeight: 1.5,
    padding: 12,
    backgroundColor: "#eef2ff",
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: INDIGO,
    marginBottom: 18,
  },
  narrativeLabel: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: INDIGO_DARK, marginBottom: 4, letterSpacing: 0.5 },

  sectionHead: { flexDirection: "row", alignItems: "center", marginTop: 16, marginBottom: 8 },
  sectionBar: { width: 3, height: 12, backgroundColor: INDIGO, marginRight: 6, borderRadius: 2 },
  sectionTitle: { fontSize: 12, fontFamily: "Helvetica-Bold", color: SLATE_900 },
  sectionMeta: { fontSize: 8.5, color: SLATE_500, marginLeft: 6 },

  warning: {
    fontSize: 8.5,
    padding: 8,
    backgroundColor: "#fffbeb",
    color: "#92400e",
    borderRadius: 4,
    borderLeftWidth: 2,
    borderLeftColor: AMBER,
    marginBottom: 8,
  },

  row: { flexDirection: "row", alignItems: "center", paddingVertical: 6, paddingHorizontal: 6, borderRadius: 3 },
  rowAlt: { backgroundColor: "#f8fafc" },
  rowLabel: { flex: 3 },
  rowNote: { fontSize: 7.5, color: SLATE_500, marginTop: 1 },
  rowValue: { flex: 1.2, textAlign: "right", fontFamily: "Helvetica-Bold" },

  barTrack: { height: 4, backgroundColor: SLATE_200, borderRadius: 2, marginTop: 3, width: 70 },
  barFill: { height: 4, backgroundColor: INDIGO, borderRadius: 2 },

  priorityPill: { fontSize: 7, fontFamily: "Helvetica-Bold", textTransform: "uppercase" },

  paletteRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 10 },
  swatch: { width: 20, height: 20, borderRadius: 10, borderWidth: 0.5, borderColor: SLATE_200 },

  ideaBlock: { marginBottom: 6 },
  ideaLabel: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: INDIGO_DARK, marginBottom: 3 },
  ideaItem: { fontSize: 9, marginBottom: 2 },

  footer: {
    position: "absolute",
    bottom: 18,
    left: 32,
    right: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7.5,
    color: SLATE_500,
    borderTopWidth: 0.5,
    borderTopColor: SLATE_200,
    paddingTop: 6,
  },
});

function SectionHeading({ title, meta }: { title: string; meta?: string }) {
  return (
    <View style={styles.sectionHead}>
      <View style={styles.sectionBar} />
      <Text style={styles.sectionTitle}>{title}</Text>
      {meta && <Text style={styles.sectionMeta}>{meta}</Text>}
    </View>
  );
}

export function PlanDocument({ plan }: { plan: PlanResult }) {
  const { input, budget, timeline, vendors, ideas } = plan;
  const sortedTasks = [...timeline.tasks].sort((a, b) => b.daysBeforeEvent - a.daysBeforeEvent);

  return (
    <Document title={`${input.eventName} — EventGenie Plan`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <View style={styles.brandRow}>
            <Text style={styles.brandMark}>EventGenie</Text>
            <Text style={styles.brandTag}>AI Celebration & Event Planner</Text>
          </View>
          <Text style={styles.eventTitle}>{input.eventName}</Text>
          <Text style={styles.eventMeta}>
            {EVENT_TYPE_LABELS[input.eventType]} · {input.location} · {input.guestCount} guests ·{" "}
            {formatDate(input.eventDate)}
          </Text>
        </View>

        <View style={styles.content}>
          {plan.aiNarrative && (
            <View style={styles.narrative}>
              <Text style={styles.narrativeLabel}>AI-PERSONALIZED SUMMARY</Text>
              <Text>{sanitizeForPdf(plan.aiNarrative)}</Text>
            </View>
          )}

          <SectionHeading
            title="Budget breakdown"
            meta={`${formatInr(budget.total)} total · ~${formatInr(budget.perGuest)}/guest`}
          />
          {budget.warning && (
            <Text style={styles.warning}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>Note: </Text>
              {sanitizeForPdf(budget.warning)}
            </Text>
          )}
          {budget.lines.map((line, i) => (
            <View key={line.category} style={[styles.row, i % 2 === 1 ? styles.rowAlt : undefined]}>
              <View style={styles.rowLabel}>
                <Text>{line.category}</Text>
                <Text style={styles.rowNote}>{line.note}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${line.percent}%` }]} />
                </View>
              </View>
              <Text style={styles.rowValue}>
                {line.percent}% · {formatInr(line.amount)}
              </Text>
            </View>
          ))}

          <SectionHeading
            title="Countdown checklist"
            meta={`${timeline.daysUntilEvent} days to go${timeline.urgentMode ? " · urgent mode" : ""}`}
          />
          {sortedTasks.map((task, i) => (
            <View key={task.id} style={[styles.row, i % 2 === 1 ? styles.rowAlt : undefined]}>
              <Text style={{ flex: 3 }}>{task.task}</Text>
              <Text style={{ flex: 1.2, fontSize: 8 }}>{task.category}</Text>
              <Text style={{ flex: 1.3, fontSize: 8 }}>
                due {formatDate(task.dueDate)}
                {task.overdue ? " · overdue" : ""}
              </Text>
              <Text style={[styles.priorityPill, { flex: 1, textAlign: "right", color: PRIORITY_COLORS[task.priority] }]}>
                {task.priority}
              </Text>
            </View>
          ))}

          <SectionHeading title="Vendor checklist" />
          {vendors.items.map((item, i) => (
            <View key={item.category} style={[styles.row, i % 2 === 1 ? styles.rowAlt : undefined]}>
              <View style={{ flex: 2 }}>
                <Text>{item.category}</Text>
                <Text style={styles.rowNote}>{item.tips}</Text>
              </View>
              <Text style={{ flex: 1, fontSize: 8 }}>{item.leadTimeWeeks}w lead time</Text>
              <Text style={[styles.priorityPill, { flex: 1, color: PRIORITY_COLORS[item.priority] }]}>
                {item.priority}
              </Text>
              <Text style={{ flex: 1.4, fontSize: 7.5, textAlign: "right", color: ROSE, fontFamily: "Helvetica-Bold" }}>
                {item.bookImmediately ? "BOOK NOW" : ""}
              </Text>
            </View>
          ))}

          <SectionHeading title="Personalized ideas" />
          <View style={styles.paletteRow}>
            {ideas.palette.map((color) => (
              <View key={color} style={{ alignItems: "center", gap: 2 }}>
                <View style={[styles.swatch, { backgroundColor: color }]} />
                <Text style={{ fontSize: 6.5, color: SLATE_500 }}>{color}</Text>
              </View>
            ))}
          </View>
          <View style={styles.ideaBlock}>
            <Text style={styles.ideaLabel}>Theme touches</Text>
            {ideas.themeIdeas.map((idea) => (
              <Text key={idea} style={styles.ideaItem}>
                • {idea}
              </Text>
            ))}
          </View>
          <View style={styles.ideaBlock}>
            <Text style={styles.ideaLabel}>Activity ideas</Text>
            {ideas.activityIdeas.map((idea) => (
              <Text key={idea} style={styles.ideaItem}>
                • {idea}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text>Generated by EventGenie · {formatDate(plan.generatedAt)}</Text>
          <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
