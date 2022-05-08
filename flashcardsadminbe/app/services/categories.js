// needs to be in this format so that json decode works properly
exports.setCategoryArr = function() {
  let categoryArr = {};
  categoryArr['Programming'] = ['Javascript', 'ReactJS', 'Version Control'];
  //categoryArr['Programming'] = ['Javascript', 'ReactJS', 'NodeJS', 'PHP', 'Version Control', 'Linux'];
  categoryArr['AWS Certification'] = ['Cloud Practitioner', 'DevOps Developer Associate', 'DevOps Engineer Professional'];
  //categoryArr['AWS Certification'] = ['Cloud Practitioner', 'SysOps Administrator Associate', 'Developer Associate', 'DevOps Engineer Professional', 'Solutions Architect Associate', 'Solutions Architect Professional'];
  categoryArr['Language'] = ['Spanish', 'French'];
  categoryArr['Physics'] = ['Introductory'];
  categoryArr['Math'] = ['Algebra'];
  return categoryArr;
}

exports.getParentCategory = function(subcategory) {
  let categoryArr = exports.setCategoryArr();
  for(let category in categoryArr) {
    if (categoryArr[category].includes(subcategory)) {
      return category;
    }
  }
}
