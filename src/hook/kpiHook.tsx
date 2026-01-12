import { useSelector } from 'react-redux';

export const useKpiData = () => {
  const kpi = useSelector((state: any) => state.kpi);

  return {
    // Data 
    kpis: kpi.kpis.data,
    totalKpi: kpi?.totalKpi?.paginations?.total,
    kpiChild: kpi.kpiChild.data,
    totalKpiChild: kpi?.totalKpiChild?.paginations?.total,
    units: kpi.units.data,

    // Loading states
    isLoadingKpis: kpi.kpis.loading,

    // Error states
    ErrorKpis: kpi.kpis.error,

    // Status codes
    StatusKpi: kpi.kpis.status,
  };
};
