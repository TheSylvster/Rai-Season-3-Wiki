use strict; use warnings; use File::Path qw(make_path);
# Writes an index.html for every page in assets/content.js (and 404.html).
# Usage (from the repo folder): perl tools/make-pages.pl .
my $repo = shift or die "usage: mkshells.pl <repo>\n";
local $/;
open my $f, '<:raw', "$repo/assets/content.js" or die "content.js: $!";
my $js = <$f>; close $f;
my @pages;
while ($js =~ /\{path:\s*"([^"]*)",\s*title:\s*"([^"]*)".*?summary:\s*"([^"]*)"/sg) { push @pages, [$1, $2, $3]; }
die "no pages found\n" unless @pages;

sub esc { my $s = shift; $s =~ s/&/&amp;/g; $s =~ s/</&lt;/g; $s =~ s/"/&quot;/g; return $s; }

sub shell {
  my ($prefix, $page, $title, $summary) = @_;
  return <<"HTML";
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>$title</title>
<meta name="description" content="$summary">
<meta name="theme-color" content="#070b1a">
<link rel="icon" href="${prefix}assets/icon.png" type="image/png">
<link rel="stylesheet" href="${prefix}assets/wiki.css">
</head>
<body class="wiki" data-page="$page">
<noscript><p style="padding:24px;color:#fff;font-family:system-ui,sans-serif">The Rai Season 3 Wiki needs JavaScript to show its pages.</p></noscript>
<script src="${prefix}assets/content.js"></script>
<script src="${prefix}assets/wiki.js"></script>
</body>
</html>
HTML
}

for my $p (@pages) {
  my ($path, $title, $summary) = @$p;
  my $depth = $path eq '' ? 0 : scalar(split m{/}, $path);
  my $prefix = '../' x $depth;
  my $dir = $path eq '' ? $repo : "$repo/$path";
  make_path($dir);
  my $full = $path eq '' ? 'Rai Season 3 Wiki' : esc($title) . ' &mdash; Rai Season 3 Wiki';
  open my $o, '>:raw', "$dir/index.html" or die "$dir: $!";
  print $o shell($prefix, $path, $full, esc($summary));
  close $o;
  print "wrote ", ($path eq '' ? '/' : "/$path/"), "\n";
}

# GitHub Pages shows 404.html for any address that doesn't exist, at any depth, so it uses full paths.
open my $o, '>:raw', "$repo/404.html" or die;
print $o shell('/Rai-Season-3-Wiki/', '404', 'Page not found &mdash; Rai Season 3 Wiki', 'This page does not exist.');
close $o;
print "wrote 404.html\n";

