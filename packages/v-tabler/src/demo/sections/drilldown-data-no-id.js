import delay from '@/utils/delay'

export const baseDrilldownItems = [
    { name: 'HR', salary: 185000, tenure: 4.2, employeeCount: 3 },
    { name: 'Engineering', salary: 420000, tenure: 3.8, employeeCount: 5 },
    { name: 'Sales', salary: 250000, tenure: 3.1, employeeCount: 4 },
    { name: 'Marketing', salary: 210000, tenure: 4.5, employeeCount: 3 },
    { name: 'Finance', salary: 230000, tenure: 5.2, employeeCount: 3 },
    { name: 'Customer Support', salary: 160000, tenure: 2.8, employeeCount: 4 },
    { name: 'IT Support', salary: 175000, tenure: 3.5, employeeCount: 3 },
    { name: 'Legal', salary: 195000, tenure: 6.0, employeeCount: 2 },
    { name: 'Operations', salary: 260000, tenure: 4.0, employeeCount: 4 },
    { name: 'R&D', salary: 310000, tenure: 3.9, employeeCount: 4 }
]

const drilldownItems = {
    HR: [
        { name: 'Anna Schmidt', salary: 60000, tenure: 5 },
        { name: 'Lukas Weber', salary: 55000, tenure: 3 },
        { name: 'Mia Fischer', salary: 70000, tenure: 4.5 }
    ],
    Engineering: [
        { name: 'Jonas Meyer', salary: 90000, tenure: 4 },
        { name: 'Lea Wagner', salary: 85000, tenure: 3 },
        { name: 'Paul Becker', salary: 80000, tenure: 2 },
        { name: 'Clara Hoffmann', salary: 85000, tenure: 5 },
        { name: 'Tim Schulz', salary: 80000, tenure: 5 }
    ],
    Sales: [
        { name: 'Felix Braun', salary: 65000, tenure: 2 },
        { name: 'Laura Krüger', salary: 70000, tenure: 4 },
        { name: 'Nina Hartmann', salary: 60000, tenure: 3 },
        { name: 'David Lange', salary: 55000, tenure: 3 }
    ],
    Marketing: [
        { name: 'Sophie König', salary: 70000, tenure: 5 },
        { name: 'Jan Peters', salary: 65000, tenure: 4 },
        { name: 'Emily Roth', salary: 75000, tenure: 4.5 }
    ],
    Finance: [
        { name: 'Max Bauer', salary: 80000, tenure: 6 },
        { name: 'Julia Graf', salary: 75000, tenure: 5 },
        { name: 'Leon Wolf', salary: 75000, tenure: 4.5 }
    ],
    'Customer Support': [
        { name: 'Tom Neumann', salary: 40000, tenure: 2 },
        { name: 'Sarah Frank', salary: 42000, tenure: 3 },
        { name: 'Chris Albrecht', salary: 38000, tenure: 2.5 },
        { name: 'Lisa Schuster', salary: 40000, tenure: 3 }
    ],
    'IT Support': [
        { name: 'Daniel Vogel', salary: 60000, tenure: 4 },
        { name: 'Marie Keller', salary: 55000, tenure: 3 },
        { name: 'Oliver Schwarz', salary: 60000, tenure: 3.5 }
    ],
    Legal: [
        { name: 'Dr. Eva Sommer', salary: 100000, tenure: 7 },
        { name: 'Felix Jäger', salary: 95000, tenure: 5 }
    ],
    Operations: [
        { name: 'Andreas Busch', salary: 70000, tenure: 4 },
        { name: 'Katrin Otto', salary: 65000, tenure: 3 },
        { name: 'Stefan Berg', salary: 60000, tenure: 5 },
        { name: 'Nadine Krause', salary: 65000, tenure: 4 }
    ],
    'R&D': [
        { name: 'Philipp Brandt', salary: 80000, tenure: 3 },
        { name: 'Hannah Seidel', salary: 75000, tenure: 4 },
        { name: 'Tobias Lindner', salary: 85000, tenure: 5 },
        { name: 'Vanessa Kurz', salary: 70000, tenure: 3.5 }
    ]
}

export const drilldownFields = [
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

export const fetchDepartmentDetails = async item => {
    await delay(1500)
    return drilldownItems[item.name] || []
}
