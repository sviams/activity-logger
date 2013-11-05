
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {
      title: 'Express',
      user: req.user
  });
};

exports.admin = function(req, res){
    res.render('admin', {
        title: 'Admin page',
        user: req.user
    });
};

exports.login = function(req, res){
    res.render('login', {
        title: 'Activity Logger',
        user: req.user
    });
};