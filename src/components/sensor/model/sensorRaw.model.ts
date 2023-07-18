export interface SensorRawData {
    source_address: string;
    sensor_id: number;
    tx_time_ms_epoch: number;
    data: {
        lux: number;
      };
  }