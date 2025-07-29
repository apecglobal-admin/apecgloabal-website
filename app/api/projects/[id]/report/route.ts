import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id

    // Get basic project info
    const projectResult = await query(`
      SELECT 
        p.*,
        c.name as company_name,
        c.logo_url as company_logo,
        e.name as manager_name
      FROM projects p
      LEFT JOIN companies c ON p.company_id = c.id
      LEFT JOIN employees e ON p.manager_id = e.id
      WHERE p.id = $1
    `, [projectId])

    if (projectResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    const project = projectResult.rows[0]

    // Get team size
    const teamResult = await query(`
      SELECT COUNT(*) as team_size
      FROM project_members
      WHERE project_id = $1
    `, [projectId])

    // Get task statistics
    const taskStatsResult = await query(`
      SELECT 
        COUNT(*) as total_tasks,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tasks,
        COUNT(CASE WHEN status = 'todo' THEN 1 END) as pending_tasks,
        COUNT(CASE WHEN status != 'completed' AND due_date < CURRENT_TIMESTAMP THEN 1 END) as overdue_tasks,
        COALESCE(SUM(estimated_hours), 0) as total_hours_estimated,
        COALESCE(SUM(actual_hours), 0) as total_hours_actual
      FROM project_tasks
      WHERE project_id = $1
    `, [projectId])

    // Get milestone statistics
    const milestoneStatsResult = await query(`
      SELECT 
        COUNT(*) as milestones_total,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as milestones_completed
      FROM project_milestones
      WHERE project_id = $1
    `, [projectId])

    // Combine all data
    const taskStats = taskStatsResult.rows[0] || {
      total_tasks: 0,
      completed_tasks: 0,
      in_progress_tasks: 0,
      pending_tasks: 0,
      overdue_tasks: 0,
      total_hours_estimated: 0,
      total_hours_actual: 0
    }

    const milestoneStats = milestoneStatsResult.rows[0] || {
      milestones_total: 0,
      milestones_completed: 0
    }

    const teamSize = teamResult.rows[0]?.team_size || 0

    // Calculate spent budget (this would typically come from expense tracking)
    // For now, we'll estimate based on actual hours and average hourly rate
    const avgHourlyRate = 400000 // 400k VND per hour average
    const spentBudget = parseInt(taskStats.total_hours_actual) * avgHourlyRate

    const reportData = {
      id: project.id,
      name: project.name,
      company_name: project.company_name,
      company_logo: project.company_logo,
      status: project.status,
      progress: project.progress || 0,
      start_date: project.start_date,
      end_date: project.end_date,
      budget: project.budget || 0,
      spent_budget: spentBudget,
      team_size: parseInt(teamSize),
      client_name: project.client_name,
      manager_name: project.manager_name,
      ...taskStats,
      ...milestoneStats,
      // Convert string numbers to integers
      total_tasks: parseInt(taskStats.total_tasks),
      completed_tasks: parseInt(taskStats.completed_tasks),
      in_progress_tasks: parseInt(taskStats.in_progress_tasks),
      pending_tasks: parseInt(taskStats.pending_tasks),
      overdue_tasks: parseInt(taskStats.overdue_tasks),
      total_hours_estimated: parseInt(taskStats.total_hours_estimated),
      total_hours_actual: parseInt(taskStats.total_hours_actual),
      milestones_total: parseInt(milestoneStats.milestones_total),
      milestones_completed: parseInt(milestoneStats.milestones_completed)
    }

    return NextResponse.json({
      success: true,
      data: reportData
    })
  } catch (error) {
    console.error('Error fetching project report:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project report' },
      { status: 500 }
    )
  }
}