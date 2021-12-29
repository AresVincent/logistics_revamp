# 報表組件文檔

## 柱狀圖

##### 引用方式

```js 
import Bar from '@/components/chart/Bar'
```

##### 參數列表

| 參數名        | 類型     | 必填 | 說明         |
|------------|--------|----|------------|
| title      | string |    | 報表標題       |
| dataSource | array  | ✔️ | 報表數據源      |
| height     | number |    | 報表高度，默認254 |

##### dataSource 示例

```json
[
    {
        "x": "1月",
        "y": 320
    },
    {
        "x": "2月",
        "y": 457
    },
    {
        "x": "3月",
        "y": 182
    }
]
```

##### 代碼示例

```html
<template>
    <bar title="柱狀圖" :dataSource="dataSource" :height="420"/>
</template>

<script>
    import Bar from '@/components/chart/Bar'

    export default {
        name: 'ChartDemo',
        components: {
            Bar
        },
        data() {
            return {
                dataSource: [
                    {
                        "x": "1月",
                        "y": 320
                    },
                    {
                        "x": "2月",
                        "y": 457
                    },
                    {
                        "x": "3月",
                        "y": 182
                    }
                ]
            }
        }
    }
</script>

<style></style>
```

## 多列柱狀圖

##### 引用方式

```js 
import BarMultid from '@/components/chart/BarMultid'
```

##### 參數列表

| 參數名        | 類型     | 必填 | 說明         |
|------------|--------|----|------------|
| title      | string |    | 報表標題       |
| fields     | array  |    | 主列字段列表     |
| dataSource | array  |    | 報表數據源      |
| height     | number |    | 報表高度，默認254 |

##### fields 示例

```json
["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug."]
```

##### dataSource 示例

```json
[
    {
        "type": "Jeecg", // 列名
        "Jan.": 18.9,
        "Feb.": 28.8,
        "Mar.": 39.3,
        "Apr.": 81.4,
        "May": 47,
        "Jun.": 20.3,
        "Jul.": 24,
        "Aug.": 35.6
    },
    {
        "type": "Jeebt",
        "Jan.": 12.4,
        "Feb.": 23.2,
        "Mar.": 34.5,
        "Apr.": 99.7,
        "May": 52.6,
        "Jun.": 35.5,
        "Jul.": 37.4,
        "Aug.": 42.4
    }
]
```

## 迷你柱狀圖

不帶標題和數據軸的柱狀圖

##### 引用方式

```js 
import MiniBar from '@/components/chart/MiniBar'
```

##### 參數列表

| 參數名        | 類型     | 必填 | 說明            |
|------------|--------|----|---------------|
| width      | number |    | 報表寬度度，默認自適應寬度 |
| height     | number |    | 報表高度，默認200    |
| dataSource | array  |    | 報表數據源         |

##### dataSource 示例

```json
[
    {
        "x": "1月",
        "y": 320
    },
    {
        "x": "2月",
        "y": 457
    },
    {
        "x": "3月",
        "y": 182
    }
]
```

## 面積圖

##### 引用方式

```js 
import AreaChartTy from '@/components/chart/AreaChartTy'
```

##### 參數列表

| 參數名        | 類型     | 必填 | 說明         |
|------------|--------|----|------------|
| title      | string |    | 報表標題       |
| dataSource | array  | ✔️ | 報表數據源      |
| height     | number |    | 報表高度，默認254 |
| lineSize   | number |    | 線的粗細，默認2   |

##### dataSource 示例

```json
[
    {
        "x": "1月",
        "y": 320
    },
    {
        "x": "2月",
        "y": 457
    },
    {
        "x": "3月",
        "y": 182
    }
]
```

## 多行折線圖

##### 引用方式

```js 
import LineChartMultid from '@/components/chart/LineChartMultid'
```

##### 參數列表

| 參數名        | 類型     | 必填 | 說明         |
|------------|--------|----|------------|
| title      | string |    | 報表標題       |
| fields     | array  |    | 主列字段列表     |
| dataSource | array  |    | 報表數據源      |
| height     | number |    | 報表高度，默認254 |

##### fields 示例

```json
["jeecg", "jeebt"]
```

##### dataSource 示例

```json
[
    {
        "type": "Jan", // 列名
        "jeecg": 7,
        "jeebt": 3.9
    },
    { "type": "Feb", "jeecg": 6.9, "jeebt": 4.2 },
    { "type": "Mar", "jeecg": 9.5, "jeebt": 5.7 },
    { "type": "Apr", "jeecg": 14.5, "jeebt": 8.5 },
    { "type": "May", "jeecg": 18.4, "jeebt": 11.9 },
    { "type": "Jun", "jeecg": 21.5, "jeebt": 15.2 },
    { "type": "Jul", "jeecg": 25.2, "jeebt": 17 },
    { "type": "Aug", "jeecg": 26.5, "jeebt": 16.6 },
    { "type": "Sep", "jeecg": 23.3, "jeebt": 14.2 },
    { "type": "Oct", "jeecg": 18.3, "jeebt": 10.3 },
    { "type": "Nov", "jeecg": 13.9, "jeebt": 6.6 },
    { "type": "Dec", "jeecg": 9.6, "jeebt": 4.8 }
]
```

## 餅狀圖

##### 引用方式

```js 
import Pie from '@/components/chart/Pie'
```

##### 參數列表

| 參數名        | 類型     | 必填 | 說明         |
|------------|--------|----|------------|
| dataSource | array  |    | 報表數據源      |
| height     | number |    | 報表高度，默認254 |

##### dataSource 示例

```json
[
    // 所有的 percent 相加等於 100
    { "item": "一月", "percent": 40 },
    { "item": "二月", "percent": 21 },
    { "item": "三月", "percent": 17 },
    { "item": "四月", "percent": 13 },
    { "item": "五月", "percent": 9 }
]
```

## 雷達圖

##### 引用方式

```js 
import Radar from '@/components/chart/Radar'
```

##### 參數列表

| 參數名        | 類型     | 必填 | 說明         |
|------------|--------|----|------------|
| dataSource | array  |    | 報表數據源      |
| height     | number |    | 報表高度，默認254 |

##### dataSource 示例

```json
[
    // score 最小值為 0，最大值為 100
    { "item": "一月", "score": 40 },
    { "item": "二月", "score": 20 },
    { "item": "三月", "score": 67 },
    { "item": "四月", "score": 43 },
    { "item": "五月", "score": 90 }
]
```

## 進度條

##### 引用方式

```js 
import MiniProgress from '@/components/chart/MiniProgress'
```

##### 參數列表

| 參數名        | 類型     | 必填 | 說明                |
|------------|--------|----|-------------------|
| percentage | number |    | 當前進度百分比，默認0，最高100 |
| target     | number |    | 目標值，默認10          |
| height     | number |    | 進度條高度，默認10        |
| color      | string |    | 進度條顏色，默認 #13C2C2  |

## 儀錶盤

##### 引用方式

```js 
import DashChartDemo from '@/components/chart/DashChartDemo'
```

##### 參數列表

| 參數名    | 類型     | 必填 | 說明             |
|--------|--------|----|----------------|
| title  | string |    | 報表標題           |
| value  | number |    | 當前值，默認6.7，最大為9 |
| height | number |    | 報表高度，默認254     |

## 排名列表

##### 引用方式

```js 
import RankList from '@/components/chart/RankList'
```

##### 參數列表

| 參數名    | 類型     | 必填 | 說明           |
|--------|--------|----|--------------|
| title  | string |    | 報表標題         |
| list   | array  |    | 排名列表數據       |
| height | number |    | 報表高度，默認自適應高度 |

##### list 示例

```json
[
    {
        "name": "北京朝陽 1 號店",
        "total": 1981
    },
    { "name": "北京朝陽 2 號店", "total": 1359 },
    { "name": "北京朝陽 3 號店", "total": 1354 },
    { "name": "北京朝陽 4 號店", "total": 263 },
    { "name": "北京朝陽 5 號店", "total": 446 },
    { "name": "北京朝陽 6 號店", "total": 796 }
]
```