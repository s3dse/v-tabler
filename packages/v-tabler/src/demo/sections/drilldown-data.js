import delay from '@/utils/delay'

export const baseDrilldownItems = [
    {
        id: 'dept-1',
        name: 'HR',
        salary: 185000,
        tenure: 4.2,
        employeeCount: 3
    },
    {
        id: 'dept-2',
        name: 'Engineering',
        salary: 420000,
        tenure: 3.8,
        employeeCount: 5
    },
    {
        id: 'dept-3',
        name: 'Sales',
        salary: 250000,
        tenure: 3.1,
        employeeCount: 4
    },
    {
        id: 'dept-4',
        name: 'Marketing',
        salary: 210000,
        tenure: 4.5,
        employeeCount: 3
    },
    {
        id: 'dept-5',
        name: 'Finance',
        salary: 230000,
        tenure: 5.2,
        employeeCount: 3
    },
    {
        id: 'dept-6',
        name: 'Customer Support',
        salary: 160000,
        tenure: 2.8,
        employeeCount: 4
    },
    {
        id: 'dept-7',
        name: 'IT Support',
        salary: 175000,
        tenure: 3.5,
        employeeCount: 3
    },
    {
        id: 'dept-8',
        name: 'Legal',
        salary: 195000,
        tenure: 6.0,
        employeeCount: 2
    },
    {
        id: 'dept-9',
        name: 'Operations',
        salary: 260000,
        tenure: 4.0,
        employeeCount: 4
    },
    {
        id: 'dept-10',
        name: 'R&D',
        salary: 310000,
        tenure: 3.9,
        employeeCount: 4
    }
]

export const drilldownItems = {
    'dept-1': [
        { id: 'emp-1', name: 'Anna Schmidt', salary: 60000, tenure: 5 },
        { id: 'emp-2', name: 'Lukas Weber', salary: 55000, tenure: 3 },
        { id: 'emp-3', name: 'Mia Fischer', salary: 70000, tenure: 4.5 }
    ],
    'dept-2': [
        { id: 'emp-4', name: 'Jonas Meyer', salary: 90000, tenure: 4 },
        { id: 'emp-5', name: 'Lea Wagner', salary: 85000, tenure: 3 },
        { id: 'emp-6', name: 'Paul Becker', salary: 80000, tenure: 2 },
        { id: 'emp-7', name: 'Clara Hoffmann', salary: 85000, tenure: 5 },
        { id: 'emp-8', name: 'Tim Schulz', salary: 80000, tenure: 5 }
    ],
    'dept-3': [
        { id: 'emp-9', name: 'Felix Braun', salary: 65000, tenure: 2 },
        { id: 'emp-10', name: 'Laura Krüger', salary: 70000, tenure: 4 },
        { id: 'emp-11', name: 'Nina Hartmann', salary: 60000, tenure: 3 },
        { id: 'emp-12', name: 'David Lange', salary: 55000, tenure: 3 }
    ],
    'dept-4': [
        { id: 'emp-13', name: 'Sophie König', salary: 70000, tenure: 5 },
        { id: 'emp-14', name: 'Jan Peters', salary: 65000, tenure: 4 },
        { id: 'emp-15', name: 'Emily Roth', salary: 75000, tenure: 4.5 }
    ],
    'dept-5': [
        { id: 'emp-16', name: 'Max Bauer', salary: 80000, tenure: 6 },
        { id: 'emp-17', name: 'Julia Graf', salary: 75000, tenure: 5 },
        { id: 'emp-18', name: 'Leon Wolf', salary: 75000, tenure: 4.5 }
    ],
    'dept-6': [
        { id: 'emp-19', name: 'Tom Neumann', salary: 40000, tenure: 2 },
        { id: 'emp-20', name: 'Sarah Frank', salary: 42000, tenure: 3 },
        { id: 'emp-21', name: 'Chris Albrecht', salary: 38000, tenure: 2.5 },
        { id: 'emp-22', name: 'Lisa Schuster', salary: 40000, tenure: 3 }
    ],
    'dept-7': [
        { id: 'emp-23', name: 'Daniel Vogel', salary: 60000, tenure: 4 },
        { id: 'emp-24', name: 'Marie Keller', salary: 55000, tenure: 3 },
        { id: 'emp-25', name: 'Oliver Schwarz', salary: 60000, tenure: 3.5 }
    ],
    'dept-8': [
        { id: 'emp-26', name: 'Dr. Eva Sommer', salary: 100000, tenure: 7 },
        { id: 'emp-27', name: 'Felix Jäger', salary: 95000, tenure: 5 }
    ],
    'dept-9': [
        { id: 'emp-28', name: 'Andreas Busch', salary: 70000, tenure: 4 },
        { id: 'emp-29', name: 'Katrin Otto', salary: 65000, tenure: 3 },
        { id: 'emp-30', name: 'Stefan Berg', salary: 60000, tenure: 5 },
        { id: 'emp-31', name: 'Nadine Krause', salary: 65000, tenure: 4 }
    ],
    'dept-10': [
        { id: 'emp-32', name: 'Philipp Brandt', salary: 80000, tenure: 3 },
        { id: 'emp-33', name: 'Hannah Seidel', salary: 75000, tenure: 4 },
        { id: 'emp-34', name: 'Tobias Lindner', salary: 85000, tenure: 5 },
        { id: 'emp-35', name: 'Vanessa Kurz', salary: 70000, tenure: 3.5 }
    ]
}

export const getDetailsForDepartment = departmentId => {
    return drilldownItems[departmentId] || []
}

export const drilldownFields = [
    {
        key: 'id',
        label: 'ID',
        thClassList: 'table-col-left px-2',
        tdClassList: 'text-left px-2'
    },
    {
        key: 'name',
        label: 'Name',
        thClassList: 'table-col-left px-2',
        tdClassList: 'text-left px-2'
    },
    {
        key: 'salary',
        label: 'Total Salary / Salary',
        thClassList: 'table-col-right px-2',
        tdClassList: 'text-right px-2',
        formatter: value => (value ? `$${value.toLocaleString()}` : '')
    },
    {
        key: 'tenure',
        label: 'Avg Tenure / Tenure',
        thClassList: 'table-col-right px-2',
        tdClassList: 'text-right px-2',
        formatter: value => (value ? `${value} years` : '')
    },
    {
        key: 'employeeCount',
        label: 'Employee Count',
        thClassList: 'table-col-right px-2',
        tdClassList: 'text-right px-2'
    }
]

export const fetchDepartmentDetails = async departmentId => {
    await delay(1500)
    return getDetailsForDepartment(departmentId)
}
