import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import { ChartData } from "../services/api";
import { Colors } from "../constants/theme";

interface Props {
  data: ChartData;
}

/**
 * Renders smeco_chart JSON data using Recharts inside a WebView.
 *
 * This mirrors the SmecoChart.tsx component from the LibreChat frontend
 * but runs inside a React Native WebView since Recharts is web-only.
 * For a future optimization, we could use victory-native for native rendering.
 */
export function SmecoChart({ data }: Props) {
  const { columns, rows, chart_suggestion } = data;
  const kind = chart_suggestion?.kind || "bar";
  const x = chart_suggestion?.x || columns[0]?.name;
  const y = chart_suggestion?.y || columns[1]?.name;
  const title = chart_suggestion?.title || "";

  const screenWidth = Dimensions.get("window").width - 60;
  const chartHeight = 280;

  // Build Recharts HTML
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
      <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
      <script src="https://unpkg.com/recharts@2/umd/Recharts.js"></script>
      <style>
        body { margin: 0; padding: 8px; font-family: -apple-system, sans-serif; background: white; }
        .title { font-size: 13px; font-weight: 600; color: #2c3e50; margin-bottom: 8px; text-align: center; }
      </style>
    </head>
    <body>
      ${title ? `<div class="title">${title}</div>` : ""}
      <div id="chart"></div>
      <script>
        const { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
                XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;
        const data = ${JSON.stringify(rows)};
        const COLORS = ['#1a5276','#e74c3c','#2ecc71','#f39c12','#9b59b6','#3498db','#e67e22','#1abc9c'];

        function Chart() {
          ${kind === "bar" ? `
            return React.createElement(ResponsiveContainer, {width: '100%', height: ${chartHeight}},
              React.createElement(BarChart, {data, margin: {top: 5, right: 10, left: 0, bottom: 60}},
                React.createElement(CartesianGrid, {strokeDasharray: '3 3'}),
                React.createElement(XAxis, {dataKey: '${x}', angle: -45, textAnchor: 'end', fontSize: 10, interval: 0}),
                React.createElement(YAxis, {fontSize: 10}),
                React.createElement(Tooltip, null),
                React.createElement(Bar, {dataKey: '${y}', fill: '#1a5276'})
              )
            );
          ` : kind === "line" ? `
            return React.createElement(ResponsiveContainer, {width: '100%', height: ${chartHeight}},
              React.createElement(LineChart, {data, margin: {top: 5, right: 10, left: 0, bottom: 60}},
                React.createElement(CartesianGrid, {strokeDasharray: '3 3'}),
                React.createElement(XAxis, {dataKey: '${x}', angle: -45, textAnchor: 'end', fontSize: 10}),
                React.createElement(YAxis, {fontSize: 10}),
                React.createElement(Tooltip, null),
                React.createElement(Line, {type: 'monotone', dataKey: '${y}', stroke: '#1a5276', strokeWidth: 2})
              )
            );
          ` : kind === "pie" ? `
            return React.createElement(ResponsiveContainer, {width: '100%', height: ${chartHeight}},
              React.createElement(PieChart, null,
                React.createElement(Pie, {data, dataKey: '${y}', nameKey: '${x}', cx: '50%', cy: '50%',
                  outerRadius: 100, label: ({name, percent}) => name + ' ' + (percent*100).toFixed(0) + '%'},
                  data.map((_, i) => React.createElement(Cell, {key: i, fill: COLORS[i % COLORS.length]}))
                ),
                React.createElement(Tooltip, null)
              )
            );
          ` : `
            return React.createElement('div', {style: {padding: 20, textAlign: 'center', color: '#7f8c8d'}},
              'Chart type "${kind}" not yet supported in mobile');
          `}
        }
        ReactDOM.render(React.createElement(Chart), document.getElementById('chart'));
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        source={{ html }}
        style={{ width: screenWidth, height: chartHeight + 40 }}
        scrollEnabled={false}
        javaScriptEnabled={true}
        originWhitelist={["*"]}
      />
      <Text style={styles.rowCount}>{rows.length} rows</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.chartBackground,
    borderRadius: 8,
    overflow: "hidden",
  },
  rowCount: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: "right",
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
});
