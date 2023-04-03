export const MetaData = {
    "CO PO Map": {
        headers: [
            // { checkbox: { idProp: '_id' }, prop: 'checkbox' },
            { isFilterable: false, isSortable: false, prop: '_id', title: 'Id' },
            { isFilterable: true, isSortable: true, prop: 'fk_Subject Code', title: 'Subject Code' },
            { isFilterable: true, isSortable: true, prop: 'CO', title: 'CO' },
            { isFilterable: true, isSortable: true, prop: 'PO', title: 'PO' },
            { isFilterable: true, isSortable: true, prop: 'Value', title: 'Value' },
        ]
    },
    Class: {
        headers: [
            // { checkbox: { idProp: '_id' }, prop: 'checkbox' },
            { isFilterable: false, isSortable: false, prop: '_id', title: 'Id' },
            { isFilterable: true, isSortable: true, prop: 'fk_Department', title: 'Department' },
            { isFilterable: true, isSortable: true, prop: 'Semester', title: 'Semester' },
            { isFilterable: true, isSortable: true, prop: 'Section', title: 'Section' },
        ]
    },
    "Class Allocation": {
        headers: [
            // { checkbox: { idProp: '_id' }, prop: 'checkbox' },
            { isFilterable: false, isSortable: false, prop: '_id', title: 'Id' },
            { isFilterable: true, isSortable: true, prop: 'fk_Class ID', title: 'Class' },
            { isFilterable: true, isSortable: true, prop: 'fk_USN', title: 'USN' },
        ]
    },
    Department: {
        headers: [
            // { checkbox: { idProp: '_id' }, prop: 'checkbox' },
            { isFilterable: false, isSortable: false, prop: '_id', title: 'Id' },
            { isFilterable: true, isSortable: true, prop: 'Department Name', title: 'Name' },
            { isFilterable: true, isSortable: false, prop: 'fk_HoD ID', title: 'Head of Department' },
        ]
    },
    Marks: {
        headers: [
            // { checkbox: { idProp: '_id' }, prop: 'checkbox' },
            { isFilterable: false, isSortable: false, prop: '_id', title: 'Id' },
            { isFilterable: true, isSortable: true, prop: 'fk_USN', title: 'USN' },
            { isFilterable: true, isSortable: true, prop: 'fk_Subject Code', title: 'Subject Code' },
            // { isFilterable: true, isSortable: false, prop: 'Marks Gained', title: 'Marks Gained' },
        ]
    },
    Student: {
        headers: [
            // { checkbox: { idProp: '_id' }, prop: 'checkbox' },
            { isFilterable: false, isSortable: false, prop: '_id', title: 'Id' },
            { isFilterable: true, isSortable: true, prop: 'USN', title: 'USN' },
            { isFilterable: true, isSortable: true, prop: 'Student Name', title: 'Name' },
            { isFilterable: true, isSortable: true, prop: 'fk_Department', title: 'Department' },
        ]
    },
    Subject: {
        headers: [
            // { checkbox: { idProp: '_id' }, prop: 'checkbox' },
            { isFilterable: false, isSortable: false, prop: '_id', title: 'Id' },
            { isFilterable: true, isSortable: true, prop: 'Scheme Code', title: 'Scheme Code' },
            { isFilterable: true, isSortable: true, prop: 'Subject Code', title: 'Subject Code' },
            { isFilterable: true, isSortable: true, prop: 'Subject Name', title: 'Name' },
            { isFilterable: true, isSortable: true, prop: 'Semester', title: 'Semester' },
            // { isFilterable: false, isSortable: false, prop: 'Max Marks', title: 'Max Marks' },
            { isFilterable: true, isSortable: true, prop: 'fk_Department', title: 'Department' },
        ]
    },
    Teacher: {
        headers: [
            // { checkbox: { idProp: '_id' }, prop: 'checkbox' },
            { isFilterable: false, isSortable: false, prop: '_id', title: 'Id' },
            { isFilterable: true, isSortable: true, prop: 'Teacher Name', title: 'Name' },
            { isFilterable: true, isSortable: true, prop: 'Mail', title: 'Mail Id' },
            { isFilterable: true, isSortable: true, prop: 'fk_Department', title: 'Department' },
            { isFilterable: true, isSortable: false, prop: 'Role', title: 'Role' },
        ]
    },
    "Teacher Allocation": {
        headers: [
            // { checkbox: { idProp: '_id' }, prop: 'checkbox' },
            { isFilterable: false, isSortable: false, prop: '_id', title: 'Id' },
            { isFilterable: true, isSortable: true, prop: 'fk_Teacher ID', title: 'Teacher' },
            { isFilterable: true, isSortable: true, prop: 'fk_Subject Code', title: 'Subject Code' },
            { isFilterable: true, isSortable: false, prop: 'fk_Class ID', title: 'Class' },
            { isFilterable: true, isSortable: true, prop: 'fk_Department', title: 'Department' },
            {
              prop: "button",
              cell: (row) => (
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    alert(`${row.username}'s score is ${row.score}`);
                  }}
                >
                  Click me
                </Button>
              )
            }
        ]
    },
};
